from fastapi import APIRouter, HTTPException, UploadFile, File, Form, status
from app.services.scam_detector import scam_detector_engine
from app.schemas.schemas import ScamDetectionRequest, ScamDetectionResponse, HTTPErrorDetail

router = APIRouter(prefix="/ai", tags=["AI Cyber Fraud Detection Engine"])

@router.post(
    "/detect-scam",
    response_model=ScamDetectionResponse,
    responses={
        400: {"model": HTTPErrorDetail, "description": "Invalid input text payload"}
    }
)
def analyze_scam_text(req: ScamDetectionRequest):
    """
    AI Scam Detection Endpoint:
    Analyzes SMS, WhatsApp chat logs, Emails, or Call Transcripts against Indian Cybercrime taxonomy
    (Digital Arrest, KYC Fraud, Investment Scam, Lottery Scam, Parcel Scam, Job Scam).
    Returns Scam Type, Confidence (0.0 - 1.0), Risk Score (0 - 100), Suspicious Keywords, and Explanation.
    """
    if not req.text_content or not req.text_content.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Text content cannot be empty.")

    return scam_detector_engine.detect_scam(req.text_content, req.source_type)

@router.post(
    "/detect-scam-file",
    response_model=ScamDetectionResponse,
    responses={
        400: {"model": HTTPErrorDetail, "description": "Invalid file format or empty content"}
    }
)
async def analyze_scam_transcript_file(
    source_type: str = Form("CALL_TRANSCRIPT"),
    file: UploadFile = File(...)
):
    """
    AI Scam Detection File Endpoint:
    Uploads a transcript file (.txt, .pdf, .eml), extracts text, and runs AI scam classification.
    """
    content_bytes = await file.read()
    try:
        text_content = content_bytes.decode('utf-8', errors='ignore')
    except Exception:
        text_content = str(content_bytes)

    if not text_content or not text_content.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file contains no readable text.")

    return scam_detector_engine.detect_scam(text_content, source_type)
