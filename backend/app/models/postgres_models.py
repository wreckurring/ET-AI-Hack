import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    POLICE_OFFICER = "POLICE_OFFICER"
    CYBER_CELL = "CYBER_CELL"
    FINANCIAL_INSTITUTION = "FINANCIAL_INSTITUTION"
    ADMIN = "ADMIN"

class FreezeState(str, enum.Enum):
    PENDING = "PENDING"
    UNDER_REVIEW = "UNDER_REVIEW"
    FREEZE_REQUESTED = "FREEZE_REQUESTED"
    BANK_ACKNOWLEDGED = "BANK_ACKNOWLEDGED"
    ACCOUNT_FROZEN = "ACCOUNT_FROZEN"
    FAILED = "FAILED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    badge_number = Column(String(100), nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.CITIZEN, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(512), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="refresh_tokens")

class FraudReport(Base):
    __tablename__ = "fraud_reports"

    id = Column(Integer, primary_key=True, index=True)
    ack_number = Column(String(100), unique=True, index=True, nullable=False)
    victim_name = Column(String(255), nullable=False)
    victim_phone = Column(String(50), nullable=False)
    victim_email = Column(String(255), nullable=True)
    victim_state = Column(String(100), nullable=False, default="Delhi")
    victim_district = Column(String(100), nullable=False, default="Delhi NCR")
    category = Column(String(100), nullable=False)
    amount_lost = Column(Float, nullable=False, default=0.0)
    utr_number = Column(String(100), nullable=True, index=True)
    target_upi_id = Column(String(255), nullable=True, index=True)
    target_ifsc = Column(String(50), nullable=True)
    target_account_no = Column(String(100), nullable=True, index=True)
    scammer_phone = Column(String(50), nullable=True, index=True)
    scammer_url_app = Column(String(512), nullable=True)
    scammer_ip_address = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_address = Column(String(512), nullable=True)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="NEW", nullable=False)
    risk_score = Column(Integer, default=50, nullable=False)
    is_frozen = Column(Boolean, default=False, nullable=False)
    geom_wkt = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    evidence_files = relationship("EvidenceFile", back_populates="report", cascade="all, delete-orphan")
    freeze_actions = relationship("FastFreezeAction", back_populates="report", cascade="all, delete-orphan")

class EvidenceFile(Base):
    __tablename__ = "evidence_files"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("fraud_reports.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    hash_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("FraudReport", back_populates="evidence_files")

class FastFreezeAction(Base):
    __tablename__ = "fast_freeze_actions"

    id = Column(Integer, primary_key=True, index=True)
    action_reference = Column(String(100), unique=True, index=True, nullable=False)
    report_id = Column(Integer, ForeignKey("fraud_reports.id"), nullable=False)
    target_identifier = Column(String(255), nullable=False)
    beneficiary_bank = Column(String(255), nullable=False)
    amount_held = Column(Float, nullable=False)
    freeze_status = Column(SQLEnum(FreezeState), default=FreezeState.PENDING, nullable=False)
    interbank_ack_token = Column(String(255), nullable=True)
    police_badge = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("FraudReport", back_populates="freeze_actions")
    audit_logs = relationship("FreezeAuditLog", back_populates="freeze_action", cascade="all, delete-orphan")

class FreezeAuditLog(Base):
    __tablename__ = "freeze_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    freeze_action_id = Column(Integer, ForeignKey("fast_freeze_actions.id"), nullable=False)
    from_state = Column(String(50), nullable=False)
    to_state = Column(String(50), nullable=False)
    actor_badge = Column(String(100), nullable=False)
    interbank_token = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    freeze_action = relationship("FastFreezeAction", back_populates="audit_logs")

class CounterfeitCurrencyReport(Base):
    __tablename__ = "counterfeit_currency_reports"

    id = Column(Integer, primary_key=True, index=True)
    ack_number = Column(String(100), unique=True, index=True, nullable=False)
    denomination = Column(Integer, nullable=False)  # e.g. 500, 200, 100, 2000
    serial_number = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    seizure_location = Column(String(255), nullable=False)
    suspected_source = Column(String(255), nullable=True)
    fake_notes_count = Column(Integer, default=1, nullable=False)
    image_url = Column(String(512), nullable=True)
    reporting_agency = Column(String(255), nullable=False, default="Police Station")
    risk_level = Column(String(50), default="HIGH", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
