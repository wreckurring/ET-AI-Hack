import os
import uuid
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user, require_roles
from app.models.postgres_models import FraudReport, EvidenceFile, User, UserRole
from app.schemas.schemas import FraudReportCreate, FraudReportResponse, EvidenceResponse, HTTPErrorDetail
from app.services.hash_service import (
    validate_file_metadata,
    verify_evidence_hash_strict,
    MAX_FILE_SIZE_BYTES
)

router = APIRouter(prefix="/reports", tags=["Fraud Reports Engine"])

@router.post(
    "",
    response_model=FraudReportResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": HTTPErrorDetail, "description": "Invalid financial or report parameters"},
        422: {"model": HTTPErrorDetail, "description": "Unprocessable validation error"}
    }
)
def submit_fraud_report(report_in: FraudReportCreate, db: Session = Depends(get_db)):
    """
    Citizen Endpoint: Submit a new cyber fraud incident report into PostgreSQL database.
    Generates a unique reference ACK number (RK-2026-XXXX).
    """
    ack_code = f"RK-2026-{random.randint(1000, 9999)}"
    
    # Calculate AI risk score based on financial threshold and scammer patterns
    risk_score = 65
    if report_in.amount_lost > 100000:
        risk_score += 15
    if report_in.target_upi_id or report_in.utr_number:
        risk_score += 10
    if report_in.scammer_phone:
        risk_score += 5
    risk_score = min(risk_score, 99)

    db_report = FraudReport(
        ack_number=ack_code,
        victim_name=report_in.victim_name,
        victim_phone=report_in.victim_phone,
        victim_email=report_in.victim_email,
        victim_state=report_in.victim_state,
        victim_district=report_in.victim_district,
        category=report_in.category,
        amount_lost=report_in.amount_lost,
        utr_number=report_in.utr_number,
        target_upi_id=report_in.target_upi_id,
        target_ifsc=report_in.target_ifsc,
        target_account_no=report_in.target_account_no,
        scammer_phone=report_in.scammer_phone,
        scammer_url_app=report_in.scammer_url_app,
        scammer_ip_address=report_in.scammer_ip_address,
        latitude=report_in.latitude or 28.6139,
        longitude=report_in.longitude or 77.2090,
        location_address=report_in.location_address,
        description=report_in.description,
        status="NEW",
        risk_score=risk_score
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.post(
    "/upload-evidence/{report_id}",
    response_model=EvidenceResponse,
    responses={
        400: {"model": HTTPErrorDetail, "description": "File size exeeded, unsupported format, or SHA-256 mismatch"},
        404: {"model": HTTPErrorDetail, "description": "Fraud Report not found"}
    }
)
async def upload_evidence(
    report_id: int,
    client_sha256: str = Form(..., description="Client-side pre-calculated SHA-256 hash"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Evidence Multipart Upload Endpoint:
    1. Validates file size (max 10MB) & extension (.png, .jpg, .jpeg, .pdf, .webp).
    2. Recalculates SHA-256 hash on server.
    3. Rejects upload with HTTP 400 if client SHA-256 hash does not match server recalculated hash.
    4. Saves file under /uploads and stores metadata in PostgreSQL.
    """
    report = db.query(FraudReport).filter(FraudReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Fraud Report #{report_id} not found")

    content = await file.read()
    file_size = len(content)

    # 1. Validate File Metadata (Size & Extension)
    is_valid_meta, err_msg = validate_file_metadata(file.filename, file.content_type, file_size)
    if not is_valid_meta:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=err_msg)

    # 2. Strict SHA-256 Recalculation & Mismatch Check
    is_match, server_sha256, client_hash_norm = verify_evidence_hash_strict(content, client_sha256)
    if not is_match:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"SHA-256 Evidence Mismatch Error: Server computed hash ({server_sha256}) does not match client hash ({client_sha256}). Upload rejected due to potential file corruption or tampering."
        )

    # 3. Save file locally under /uploads
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    sanitized_filename = f"{uuid.uuid4().hex}_{file.filename}"
    filepath = os.path.join(settings.UPLOAD_DIR, sanitized_filename)

    with open(filepath, "wb") as f:
        f.write(content)

    # 4. Store Evidence Metadata in PostgreSQL
    evidence = EvidenceFile(
        report_id=report_id,
        file_name=file.filename,
        file_path=filepath,
        file_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        sha256_hash=server_sha256,
        hash_verified=True
    )

    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence

@router.get("", response_model=List[FraudReportResponse])
def get_all_reports(
    status: Optional[str] = None,
    state: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Police Endpoint: List all registered cyber fraud reports from PostgreSQL."""
    query = db.query(FraudReport)
    if status:
        query = query.filter(FraudReport.status == status)
    if state:
        query = query.filter(FraudReport.victim_state == state)
    if category:
        query = query.filter(FraudReport.category == category)
    
    reports = query.order_by(FraudReport.created_at.desc()).all()
    return reports

@router.get("/track/{ack_number}", response_model=FraudReportResponse)
def track_report_by_ack(ack_number: str, db: Session = Depends(get_db)):
    """Public Endpoint: Track report status by ACK reference number."""
    report = db.query(FraudReport).filter(FraudReport.ack_number == ack_number).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found with reference number.")
    return report

@router.get("/{report_id}/pdf-export", response_class=Response)
def export_case_report_pdf(
    report_id: int,
    db: Session = Depends(get_db)
):
    """
    Generates and downloads a professional PDF Case Investigation Report: Case_Report_<ReportID>.pdf.
    Includes victim details, incident summary, AI threat score, SHA-256 chain of custody, Neo4j network summary,
    Fast-Freeze audit log timeline, and officer notes.
    """
    pdf_bytes = PDFCaseReportGenerator.generate_case_pdf_bytes(db, report_id)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=Case_Report_{report_id}.pdf"
        }
    )

@router.get("/{report_id}", response_model=FraudReportResponse)
def get_report_detail(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Police Endpoint: Retrieve detailed report and evidence chain of custody."""
    report = db.query(FraudReport).filter(FraudReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Fraud report not found.")
    return report
