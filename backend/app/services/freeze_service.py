import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.postgres_models import FastFreezeAction, FreezeAuditLog, FraudReport, FreezeState
from app.schemas.schemas import FastFreezeCreate, FreezeStatusUpdateRequest

class FastFreezeService:

    @staticmethod
    def create_freeze_request(db: Session, freeze_req: FastFreezeCreate) -> FastFreezeAction:
        """
        Creates a new Fast-Freeze request & initiates the automated audit log state machine:
        Citizen Report (PENDING) -> Verification (UNDER_REVIEW) -> Generate Request (FREEZE_REQUESTED).
        """
        report = db.query(FraudReport).filter(FraudReport.id == freeze_req.report_id).first()
        if not report:
            raise ValueError(f"Fraud report #{freeze_req.report_id} not found.")

        # Generate unique Freeze ID (FF-2026-XXXXXX)
        freeze_id = f"FF-2026-{uuid.uuid4().hex[:6].upper()}"

        freeze_action = FastFreezeAction(
            report_id=freeze_req.report_id,
            action_reference=freeze_id,
            target_identifier=freeze_req.target_identifier,
            beneficiary_bank=freeze_req.beneficiary_bank,
            amount_held=freeze_req.amount_held,
            freeze_status=FreezeState.FREEZE_REQUESTED.value,
            police_badge=freeze_req.police_badge,
            notes=freeze_req.notes,
            freeze_timestamp=datetime.utcnow()
        )

        db.add(freeze_action)
        db.flush()

        # Generate Immutable Audit Log Sequence: PENDING -> UNDER_REVIEW -> FREEZE_REQUESTED
        audit_1 = FreezeAuditLog(
            freeze_action_id=freeze_action.id,
            from_state="NONE",
            to_state=FreezeState.PENDING.value,
            changed_by_badge=freeze_req.police_badge,
            notes="Citizen Incident Report Logged",
            interbank_token=f"TOKEN-INIT-{uuid.uuid4().hex[:4].upper()}"
        )
        audit_2 = FreezeAuditLog(
            freeze_action_id=freeze_action.id,
            from_state=FreezeState.PENDING.value,
            to_state=FreezeState.UNDER_REVIEW.value,
            changed_by_badge=freeze_req.police_badge,
            notes="Officer Verification & Risk Threshold Assessment Completed",
            interbank_token=f"TOKEN-REV-{uuid.uuid4().hex[:4].upper()}"
        )
        audit_3 = FreezeAuditLog(
            freeze_action_id=freeze_action.id,
            from_state=FreezeState.UNDER_REVIEW.value,
            to_state=FreezeState.FREEZE_REQUESTED.value,
            changed_by_badge=freeze_req.police_badge,
            notes=freeze_req.notes or "Section 91 CrPC Hold Directive Issued to NPCI Gateway",
            interbank_token=f"TOKEN-REQ-{uuid.uuid4().hex[:4].upper()}"
        )

        db.add_all([audit_1, audit_2, audit_3])

        # Auto-advance to BANK_ACKNOWLEDGED -> ACCOUNT_FROZEN simulation
        audit_4 = FreezeAuditLog(
            freeze_action_id=freeze_action.id,
            from_state=FreezeState.FREEZE_REQUESTED.value,
            to_state=FreezeState.BANK_ACKNOWLEDGED.value,
            changed_by_badge="NPCI-GATEWAY",
            notes=f"Beneficiary Bank {freeze_req.beneficiary_bank} Acknowledged Hold Directive",
            interbank_token=f"ACK-NPCI-{uuid.uuid4().hex[:6].upper()}"
        )
        audit_5 = FreezeAuditLog(
            freeze_action_id=freeze_action.id,
            from_state=FreezeState.BANK_ACKNOWLEDGED.value,
            to_state=FreezeState.ACCOUNT_FROZEN.value,
            changed_by_badge="BANK-SYSTEM",
            notes=f"Target Account {freeze_req.target_identifier} Funds (₹{freeze_req.amount_held:,.2f}) Successfully Locked",
            interbank_token=f"LOCKED-{uuid.uuid4().hex[:6].upper()}"
        )
        db.add_all([audit_4, audit_5])

        # Update Freeze Action Status & Report Status
        freeze_action.freeze_status = FreezeState.ACCOUNT_FROZEN.value
        report.status = "FROZEN"
        report.is_frozen = True

        db.commit()
        db.refresh(freeze_action)
        return freeze_action

    @staticmethod
    def get_freeze_status_and_audit(db: Session, freeze_id: str) -> FastFreezeAction:
        """
        Retrieves current Fast-Freeze record and complete audit trail timeline.
        """
        freeze_action = db.query(FastFreezeAction).filter(
            (FastFreezeAction.action_reference == freeze_id) | (FastFreezeAction.id == int(freeze_id) if freeze_id.isdigit() else False)
        ).first()

        if not freeze_action:
            raise ValueError(f"Fast Freeze action with reference '{freeze_id}' not found.")

        return freeze_action

    @staticmethod
    def update_freeze_state(db: Session, freeze_id: str, update_req: FreezeStatusUpdateRequest) -> FastFreezeAction:
        """
        Updates Fast-Freeze state machine status and appends a new audit log record.
        """
        freeze_action = db.query(FastFreezeAction).filter(
            (FastFreezeAction.action_reference == freeze_id) | (FastFreezeAction.id == int(freeze_id) if freeze_id.isdigit() else False)
        ).first()

        if not freeze_action:
            raise ValueError(f"Fast Freeze action '{freeze_id}' not found.")

        old_state = freeze_action.freeze_status
        new_state = update_req.new_state

        freeze_action.freeze_status = new_state
        if new_state == FreezeState.ACCOUNT_FROZEN.value:
            report = db.query(FraudReport).filter(FraudReport.id == freeze_action.report_id).first()
            if report:
                report.status = "FROZEN"
                report.is_frozen = True

        audit_log = FreezeAuditLog(
            freeze_action_id=freeze_action.id,
            from_state=old_state,
            to_state=new_state,
            changed_by_badge=update_req.police_badge,
            notes=update_req.notes,
            interbank_token=f"TOKEN-{new_state[:3]}-{uuid.uuid4().hex[:4].upper()}"
        )

        db.add(audit_log)
        db.commit()
        db.refresh(freeze_action)
        return freeze_action
