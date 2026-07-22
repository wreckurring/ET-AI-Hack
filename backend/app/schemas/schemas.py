from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any
from datetime import datetime

# --- Error Schema ---
class HTTPErrorDetail(BaseModel):
    detail: str

# --- Auth Schemas ---
class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Any

Token = TokenSchema

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    badge_number: Optional[str] = None

LoginRequest = UserLogin

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class CitizenRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone_number: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    badge_number: Optional[str] = None

# --- Report Schemas ---
class EvidenceFileSchema(BaseModel):
    id: int
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    sha256_hash: str
    hash_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

EvidenceResponse = EvidenceFileSchema

class FraudReportCreate(BaseModel):
    victim_name: str
    victim_phone: str
    victim_email: Optional[EmailStr] = None
    victim_state: str = "Delhi"
    victim_district: str = "Delhi NCR"
    category: str
    amount_lost: float
    utr_number: Optional[str] = None
    target_upi_id: Optional[str] = None
    target_ifsc: Optional[str] = None
    target_account_no: Optional[str] = None
    scammer_phone: Optional[str] = None
    scammer_url_app: Optional[str] = None
    scammer_ip_address: Optional[str] = None
    latitude: Optional[float] = 28.6139
    longitude: Optional[float] = 77.2090
    location_address: Optional[str] = None
    description: str

class FraudReportResponse(BaseModel):
    id: int
    ack_number: str
    victim_name: str
    victim_phone: str
    victim_email: Optional[str] = None
    victim_state: str
    victim_district: str
    category: str
    amount_lost: float
    utr_number: Optional[str] = None
    target_upi_id: Optional[str] = None
    target_ifsc: Optional[str] = None
    target_account_no: Optional[str] = None
    scammer_phone: Optional[str] = None
    scammer_url_app: Optional[str] = None
    scammer_ip_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_address: Optional[str] = None
    description: str
    status: str
    risk_score: int
    is_frozen: bool
    created_at: datetime
    evidence_files: List[EvidenceFileSchema] = []

    class Config:
        from_attributes = True

# --- AI Scam Schemas ---
class AIScamDetectionRequest(BaseModel):
    text_content: str
    source_type: str = "SMS"  # SMS, WHATSAPP, EMAIL, CALL_TRANSCRIPT

class AIScamDetectionResponse(BaseModel):
    scam_type: str
    confidence: float
    risk_score: int
    suspicious_keywords: List[str]
    explanation: str

ScamDetectionRequest = AIScamDetectionRequest
ScamDetectionResponse = AIScamDetectionResponse

# --- Fast Freeze Schemas ---
class FastFreezeRequest(BaseModel):
    report_id: int
    target_identifier: str
    beneficiary_bank: str
    amount_held: float
    police_badge: str
    notes: Optional[str] = None

FastFreezeCreate = FastFreezeRequest
FreezeStatusUpdateRequest = FastFreezeRequest

class FreezeAuditLogSchema(BaseModel):
    id: int
    from_state: str
    to_state: str
    actor_badge: str
    interbank_token: Optional[str] = None
    notes: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class FastFreezeResponse(BaseModel):
    action_reference: str
    freeze_status: str
    target_identifier: str
    beneficiary_bank: str
    amount_held: float
    audit_logs: List[FreezeAuditLogSchema] = []

    class Config:
        from_attributes = True

# --- Counterfeit Currency Schemas ---
class CounterfeitReportCreate(BaseModel):
    denomination: int  # 500, 200, 100, 2000
    serial_number: str
    state: str
    district: str
    seizure_location: str
    suspected_source: Optional[str] = "Smuggling Syndicate"
    fake_notes_count: int = 1
    image_url: Optional[str] = None
    reporting_agency: Optional[str] = "State LEA / Cyber Crime Branch"

class CounterfeitReportResponse(BaseModel):
    id: int
    ack_number: str
    denomination: int
    serial_number: str
    state: str
    district: str
    seizure_location: str
    suspected_source: Optional[str] = None
    fake_notes_count: int
    reporting_agency: str
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Graph Schemas ---
class GraphIngestRequest(BaseModel):
    report_id: int
    victim_id: str
    victim_name: str
    victim_phone: str
    victim_email: Optional[str] = None
    utr_number: Optional[str] = None
    amount_lost: float
    target_upi_id: Optional[str] = None
    target_account_no: Optional[str] = None
    target_ifsc: Optional[str] = None
    scammer_phone: Optional[str] = None
    scammer_ip_address: Optional[str] = None
    device_imei: Optional[str] = None
    sim_iccid: Optional[str] = None

class NetworkGraphResponse(BaseModel):
    nodes: List[Any]
    edges: List[Any]

# --- Unified Dashboard Summary Schema ---
class DashboardSummaryResponse(BaseModel):
    active_complaints: int
    fraud_hotspots_count: int
    predicted_threats_count: int
    counterfeit_alerts_count: int
    fast_freeze_requests_count: int
    high_risk_networks_count: int
    total_protected_amount: float
    ai_risk_score: int
