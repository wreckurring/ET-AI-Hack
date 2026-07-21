from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime
import re

# Error Response Schema for OpenAPI docs
class HTTPErrorDetail(BaseModel):
    detail: str = Field(..., example="Invalid credentials or resource not found")

# Auth Schemas
class Token(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    refresh_token: str = Field(..., example="d9b1a8c2e3f4567890abcdef12345678")
    token_type: str = Field("bearer", example="bearer")
    user_name: str = Field(..., example="Inspector Vikram Singh")
    badge_number: Optional[str] = Field(None, example="INSP-8821")
    role: str = Field(..., example="POLICE_OFFICER")

class LoginRequest(BaseModel):
    username_or_badge: str = Field(..., example="INSP-8821", description="Badge number for LEA officers or Email for citizens")
    password: str = Field(..., example="police123", description="Secure BCrypt account password")

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., example="d9b1a8c2e3f4567890abcdef12345678")

class CitizenRegisterRequest(BaseModel):
    full_name: str = Field(..., example="Ramesh Kumar")
    email: EmailStr = Field(..., example="ramesh.k@gmail.com")
    phone: str = Field(..., example="+91 98102 33419")
    password: str = Field(..., min_length=6, example="CitizenPass2026!")

class UserResponse(BaseModel):
    id: int
    badge_number: Optional[str]
    full_name: str
    email: str
    phone: Optional[str]
    role: str
    department: str
    state: str

    class Config:
        from_attributes = True

# Evidence Schemas
class EvidenceCreate(BaseModel):
    file_name: str = Field(..., example="Screenshot_Bank_Debit.png")
    file_type: str = Field(..., example="image/png")
    file_size: int = Field(..., example=245000)
    sha256_hash: str = Field(..., example="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")

class EvidenceResponse(BaseModel):
    id: int
    file_name: str
    file_type: str
    file_size: int
    sha256_hash: str
    hash_verified: bool
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Report Schemas
class FraudReportCreate(BaseModel):
    victim_name: str = Field(..., example="Ramesh Kumar", description="Full name of victim")
    victim_phone: str = Field(..., example="+91 98102 33419", description="Victim WhatsApp phone number")
    victim_email: Optional[EmailStr] = Field(None, example="ramesh.k@gmail.com")
    victim_state: str = Field(..., example="Delhi", description="State of victim residence")
    victim_district: str = Field(..., example="South East Delhi", description="District name")
    category: str = Field(..., example="Phishing Scam", description="Cyber fraud classification")
    amount_lost: float = Field(..., gt=0, example=185000.0, description="Amount lost in INR")
    utr_number: Optional[str] = Field(None, example="402918471092", description="12-digit transaction UTR")
    target_upi_id: Optional[str] = Field(None, example="refund.sbi@okicici", description="Scammer target UPI handle")
    target_ifsc: Optional[str] = Field(None, example="SBIN0004921", description="Beneficiary Bank IFSC")
    target_account_no: Optional[str] = Field(None, example="30489912041", description="Beneficiary account number")
    scammer_phone: Optional[str] = Field(None, example="+91 98351 90211", description="Scammer phone number")
    scammer_url_app: Optional[str] = Field(None, example="https://sbi-kyc-update-portal.info")
    scammer_ip_address: Optional[str] = Field(None, example="103.145.72.19")
    latitude: Optional[float] = Field(28.6139, example=28.5494, description="PostGIS Latitude coordinate")
    longitude: Optional[float] = Field(77.2090, example=77.2690, description="PostGIS Longitude coordinate")
    location_address: Optional[str] = Field(None, example="Okhla Phase III, New Delhi")
    description: str = Field(..., example="Received SMS claiming SBI YONO account block. Clicked link and entered OTP.")

    @field_validator('amount_lost')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError("Amount lost must be greater than zero INR")
        return v

    @field_validator('target_upi_id')
    def validate_upi(cls, v):
        if v and "@" not in v:
            raise ValueError("Target UPI ID must follow 'handle@bank' format (e.g. scammer@okicici)")
        return v

class FraudReportResponse(BaseModel):
    id: int
    ack_number: str = Field(..., example="RK-2026-8801")
    victim_name: str
    victim_phone: str
    victim_email: Optional[str]
    victim_state: str
    victim_district: str
    category: str
    amount_lost: float
    utr_number: Optional[str]
    target_upi_id: Optional[str]
    target_ifsc: Optional[str]
    target_account_no: Optional[str]
    scammer_phone: Optional[str]
    scammer_url_app: Optional[str]
    scammer_ip_address: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    location_address: Optional[str]
    description: str
    status: str
    risk_score: int
    is_frozen: bool
    created_at: datetime
    evidence_files: List[EvidenceResponse] = []

    class Config:
        from_attributes = True

# AI Scam Detection Schemas
class ScamDetectionRequest(BaseModel):
    text_content: str = Field(..., example="Sir, this is Customs Officer from Mumbai Police. A package containing 50g MDMA drugs was seized under your name. Connect on Skype for Digital Arrest clearance immediately.", description="Text body of SMS, WhatsApp, Email, or Call Transcript")
    source_type: str = Field("SMS", example="SMS", description="Source format: SMS, WHATSAPP, EMAIL, or CALL_TRANSCRIPT")

class ScamDetectionResponse(BaseModel):
    scam_type: str = Field(..., example="Digital Arrest")
    confidence: float = Field(..., example=0.95, description="Confidence rating between 0.0 and 1.0")
    risk_score: int = Field(..., example=98, description="Risk score rating between 0 and 100")
    suspicious_keywords: List[str] = Field(..., example=["Customs Officer", "MDMA drugs", "Skype", "Digital Arrest"])
    explanation: str = Field(..., example="High severity Digital Arrest scam detected. Impersonates law enforcement demanding video call clearance under threat of arrest.")

# Fast Freeze Audit & State Machine Schemas
class FreezeAuditLogResponse(BaseModel):
    id: int
    from_state: str
    to_state: str
    changed_by_badge: str
    notes: Optional[str]
    interbank_token: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class FastFreezeCreate(BaseModel):
    report_id: int = Field(..., example=1)
    target_identifier: str = Field(..., example="refund.sbi@okicici")
    beneficiary_bank: str = Field(..., example="State Bank of India")
    amount_held: float = Field(..., example=185000.0)
    police_badge: str = Field(..., example="INSP-8821")
    notes: Optional[str] = Field("Emergency hold initiated under Section 91 CrPC cyber fraud protocol.")

class FastFreezeResponse(BaseModel):
    id: int
    action_reference: str = Field(..., example="FF-2026-88A12B")
    report_id: int
    target_identifier: str
    beneficiary_bank: str
    amount_held: float
    freeze_status: str
    freeze_timestamp: datetime
    police_badge: str
    notes: Optional[str]
    audit_logs: List[FreezeAuditLogResponse] = []

    class Config:
        from_attributes = True

class FreezeStatusUpdateRequest(BaseModel):
    new_state: str = Field(..., example="BANK_ACKNOWLEDGED", description="Target FreezeState: PENDING, UNDER_REVIEW, FREEZE_REQUESTED, BANK_ACKNOWLEDGED, ACCOUNT_FROZEN, FAILED")
    police_badge: str = Field(..., example="INSP-8821")
    notes: Optional[str] = Field(None, example="Bank branch manager acknowledged Section 91 hold directive.")


# Graph Ingest Schema
class GraphIngestRequest(BaseModel):
    report_id: int = Field(..., example=1)
    victim_name: str = Field(..., example="Ramesh Kumar")
    victim_phone: str = Field(..., example="+91 98102 33419")
    victim_email: Optional[str] = Field(None, example="ramesh.k@gmail.com")
    amount_lost: float = Field(..., example=185000.0)
    utr_number: Optional[str] = Field("402918471092", example="402918471092")
    target_upi_id: Optional[str] = Field("refund.sbi@okicici", example="refund.sbi@okicici")
    target_account_no: Optional[str] = Field("30489912041", example="30489912041")
    target_ifsc: Optional[str] = Field("SBIN0004921", example="SBIN0004921")
    scammer_phone: Optional[str] = Field("+91 98351 90211", example="+91 98351 90211")
    scammer_ip_address: Optional[str] = Field("103.145.72.19", example="103.145.72.19")
    device_imei: Optional[str] = Field("860492019481024", example="860492019481024")
    sim_iccid: Optional[str] = Field("8991048201948102948", example="8991048201948102948")

# Vis.js Graph Schemas
class GraphNode(BaseModel):
    id: str
    label: str
    group: str
    title: str
    riskScore: Optional[int] = 50

class GraphEdge(BaseModel):
    from_node: str
    to_node: str
    label: str

class NetworkGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# Hotspot Schema
class HotspotPoint(BaseModel):
    district: str
    state: str
    latitude: float
    longitude: float
    report_count: int
    total_amount: float
    risk_level: str
