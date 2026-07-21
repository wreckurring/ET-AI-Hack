from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_roles, get_current_user
from app.models.postgres_models import User, UserRole
from app.schemas.schemas import FastFreezeCreate, FastFreezeResponse, FreezeStatusUpdateRequest, HTTPErrorDetail
from app.services.freeze_service import FastFreezeService

router = APIRouter(prefix="/freeze", tags=["Fast-Freeze State Machine Engine"])

@router.post(
    "/request",
    response_model=FastFreezeResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        403: {"model": HTTPErrorDetail, "description": "Requires POLICE_OFFICER role"},
        404: {"model": HTTPErrorDetail, "description": "Target report not found"}
    }
)
def create_fast_freeze_request(
    req: FastFreezeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.POLICE_OFFICER.value, UserRole.ADMIN.value]))
):
    """
    Law Enforcement Workflow Endpoint:
    Initiates Fast-Freeze action across NPCI & Beneficiary Bank networks.
    Generates Freeze ID (FF-2026-XXXXXX), executes State Machine (PENDING -> UNDER_REVIEW -> FREEZE_REQUESTED -> BANK_ACKNOWLEDGED -> ACCOUNT_FROZEN),
    and appends immutable Audit Logs into PostgreSQL.
    """
    try:
        return FastFreezeService.create_freeze_request(db, req)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fast Freeze state machine error: {str(e)}"
        )

@router.post(
    "/trigger",
    response_model=FastFreezeResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False
)
def trigger_fast_freeze_alias(
    req: FastFreezeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Alias route for frontend compatibility."""
    return create_fast_freeze_request(req, db, current_user)

@router.get(
    "/status/{freeze_id}",
    response_model=FastFreezeResponse,
    responses={
        404: {"model": HTTPErrorDetail, "description": "Freeze reference not found"}
    }
)
def get_freeze_status_timeline(
    freeze_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieves current Fast-Freeze status and complete audit trail timeline by Freeze ID (FF-2026-XXXX).
    """
    try:
        return FastFreezeService.get_freeze_status_and_audit(db, freeze_id)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))

@router.patch(
    "/status/{freeze_id}",
    response_model=FastFreezeResponse,
    responses={
        403: {"model": HTTPErrorDetail, "description": "Requires POLICE_OFFICER role"},
        404: {"model": HTTPErrorDetail, "description": "Freeze action reference not found"}
    }
)
def update_freeze_status_state(
    freeze_id: str,
    req: FreezeStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([UserRole.POLICE_OFFICER.value, UserRole.ADMIN.value]))
):
    """
    Law Enforcement Endpoint: Updates Fast-Freeze state machine status and appends a new audit log record.
    Allowed States: PENDING, UNDER_REVIEW, FREEZE_REQUESTED, BANK_ACKNOWLEDGED, ACCOUNT_FROZEN, FAILED.
    """
    try:
        return FastFreezeService.update_freeze_state(db, freeze_id, req)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
