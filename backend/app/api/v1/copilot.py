from typing import Dict, Any
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.ocr_service import OCREvidenceAnalyzer
from app.services.voice_service import VoiceScamAnalyzer
from app.services.investigation_copilot import investigation_copilot

router = APIRouter(prefix="/ai", tags=["AI Investigation Copilot, OCR & Voice Engine"])

@router.post("/ocr-analyze")
async def analyze_ocr_evidence_screenshot(
    file: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    OCR Evidence Analysis Endpoint:
    Extracts text from screenshots of WhatsApp chats, SMS, Emails, Bank transactions, or fake notices.
    Runs text through AI Scam Detection Engine and returns extracted text, scam classification, confidence, risk score, and highlighted keywords.
    """
    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")

    return OCREvidenceAnalyzer.analyze_ocr_evidence(image_bytes, file.filename or "screenshot.png")

@router.post("/voice-analyze")
async def analyze_voice_recording_call(
    file: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Voice Scam Speech-to-Text Analysis Endpoint:
    Accepts call recordings (.wav, .mp3, .m4a), transcribes audio to text, and computes AI scam classification.
    """
    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded audio file is empty.")

    return VoiceScamAnalyzer.analyze_voice_call(audio_bytes, file.filename or "call_recording.wav")

@router.post("/investigation-copilot/{report_id}")
def generate_ai_investigation_brief(
    report_id: int,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Police AI Investigation Copilot Endpoint:
    Generates automated case summary, AI classification explanation, next investigation steps,
    connected fraud reports, evidence recommendations, and officer case notes.
    """
    return investigation_copilot.generate_investigation_brief(db, report_id)
