from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    POLICE_OFFICER = "POLICE_OFFICER"
    ANALYST = "ANALYST"
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
    badge_number = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.POLICE_OFFICER.value, nullable=False)
    department = Column(String, default="Cyber Crime Branch")
    state = Column(String, default="Delhi")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="refresh_tokens")

class FraudReport(Base):
    __tablename__ = "fraud_reports"

    id = Column(Integer, primary_key=True, index=True)
    ack_number = Column(String, unique=True, index=True, nullable=False) # RK-2026-XXXX
    
    # Victim details
    victim_name = Column(String, nullable=False)
    victim_phone = Column(String, nullable=False)
    victim_email = Column(String, nullable=True)
    victim_state = Column(String, nullable=False)
    victim_district = Column(String, nullable=False)
    
    # Fraud Financial Identifiers
    category = Column(String, nullable=False)
    amount_lost = Column(Float, nullable=False)
    utr_number = Column(String, index=True, nullable=True)
    target_upi_id = Column(String, index=True, nullable=True)
    target_ifsc = Column(String, index=True, nullable=True)
    target_account_no = Column(String, index=True, nullable=True)
    
    # Scammer metadata
    scammer_phone = Column(String, index=True, nullable=True)
    scammer_url_app = Column(String, nullable=True)
    scammer_ip_address = Column(String, nullable=True)
    
    # Location Coordinates & PostGIS Geometry
    latitude = Column(Float, nullable=True, default=28.6139)
    longitude = Column(Float, nullable=True, default=77.2090)
    location_address = Column(Text, nullable=True)
    geom_wkt = Column(Text, nullable=True) # PostGIS WKT string Representation POINT(lng lat)
    
    # Narrative & Metadata
    description = Column(Text, nullable=False)
    status = Column(String, default="NEW", nullable=False)
    risk_score = Column(Integer, default=75)
    is_frozen = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    evidence_files = relationship("EvidenceFile", back_populates="report", cascade="all, delete-orphan")
    freeze_actions = relationship("FastFreezeAction", back_populates="report", cascade="all, delete-orphan")

class EvidenceFile(Base):
    __tablename__ = "evidence_files"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("fraud_reports.id"), nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    sha256_hash = Column(String, nullable=False, index=True)
    hash_verified = Column(Boolean, default=True, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("FraudReport", back_populates="evidence_files")

class FastFreezeAction(Base):
    __tablename__ = "fast_freeze_actions"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("fraud_reports.id"), nullable=False)
    action_reference = Column(String, unique=True, index=True, nullable=False) # FF-2026-XXXX
    target_identifier = Column(String, nullable=False)
    beneficiary_bank = Column(String, nullable=False)
    amount_held = Column(Float, nullable=False)
    freeze_status = Column(String, default=FreezeState.PENDING.value, nullable=False)
    freeze_timestamp = Column(DateTime, default=datetime.utcnow)
    police_badge = Column(String, nullable=False)
    notes = Column(Text, nullable=True)

    report = relationship("FraudReport", back_populates="freeze_actions")
    audit_logs = relationship("FreezeAuditLog", back_populates="freeze_action", cascade="all, delete-orphan")

class FreezeAuditLog(Base):
    __tablename__ = "freeze_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    freeze_action_id = Column(Integer, ForeignKey("fast_freeze_actions.id"), nullable=False)
    from_state = Column(String, nullable=False)
    to_state = Column(String, nullable=False)
    changed_by_badge = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    interbank_token = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    freeze_action = relationship("FastFreezeAction", back_populates="audit_logs")
