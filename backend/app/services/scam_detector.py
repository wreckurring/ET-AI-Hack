import re
from abc import ABC, abstractmethod
from typing import List,Optional, Dict, Any, Tuple
from app.schemas.schemas import ScamDetectionResponse

class BaseScamDetector(ABC):
    """
    Abstract Base Class for AI Scam Detection Engine.
    Ensures modularity so future LLMs (Gemini / OpenAI / Ollama) can replace rule-based detection cleanly.
    """
    @abstractmethod
    def detect_scam(self, text: str, source_type: str = "SMS") -> ScamDetectionResponse:
        pass

class RuleBasedScamDetector(BaseScamDetector):
    """
    Rule-based & Pattern-matching AI Scam Detector for Indian Cybercrime Taxonomy:
    1. Digital Arrest (CBI, Customs, illegal package, MDMA/drugs, Mumbai Police, Skype video clearance)
    2. KYC Fraud (SBI YONO block, PAN update, power cut, APK file download, OTP share)
    3. Investment Scam (400% profit, Telegram VIP stock group, institutional app, crypto task)
    4. Lottery Scam (KBC Kaun Banega Crorepati, 25 Lakhs, lucky draw, processing fee tax)
    5. Parcel Scam (FedEx, Customs impounded shipment, contraband, pay clearance penalty)
    6. Job Scam (YouTube like task, part-time rating review, prepaid task deposit)
    """

    PATTERNS: Dict[str, Dict[str, Any]] = {
        "Digital Arrest": {
            "keywords": [
                "digital arrest", "cbi", "mumbai police", "customs officer", "mdma", "drugs package",
                "narcotics", "skype", "video call clearance", "arrest warrant", "cyber crime cell",
                "passport confiscated", "illegal parcel"
            ],
            "regex": r"(digital arrest|cbi|customs|mdma|drugs|skype|arrest warrant|narcotics|mumbai police)",
            "explanation": "High Severity Digital Arrest Scam Detected: Impersonates law enforcement officials (CBI/Customs/Police), claiming a suspicious package with contraband was seized in your name and demanding video call clearance under threat of arrest."
        },
        "KYC Fraud": {
            "keywords": [
                "sbi yono", "yono block", "pan card update", "kyc expired", "electricity bill",
                "power cut", "apk file", "download app", "account suspended", "update your kyc",
                "electricity officer", "discom"
            ],
            "regex": r"(yono|kyc|pan card|electricity|power cut|apk|account block|suspended)",
            "explanation": "High Severity KYC / Banking Phishing Fraud Detected: Attempts to trick victim into clicking malicious phishing links or downloading APK malware by falsely claiming account suspension or power disconnection."
        },
        "Investment Scam": {
            "keywords": [
                "400% profit", "telegram vip", "institutional stock", "trading app", "guaranteed return",
                "stock signal", "small withdrawal", "crypto profit", "high yield", "daily returns",
                "upper circuit"
            ],
            "regex": r"(400%|telegram|trading app|guaranteed return|stock signal|vip group|crypto profit|institutional)",
            "explanation": "High Severity Investment / Stock Fraud Detected: Promises unrealistically high or guaranteed trading returns via unofficial Telegram groups or fake institutional investment apps."
        },
        "Lottery Scam": {
            "keywords": [
                "kaun banega crorepati", "kbc", "25 lakhs", "cash prize", "lucky draw",
                "lottery winner", "processing fee", "gst deposit", "cheque clearance"
            ],
            "regex": r"(kbc|lottery|25 lakh|cash prize|lucky draw|processing fee|tax deposit)",
            "explanation": "Medium-High Severity Lottery / Prize Scam Detected: Falsely claims victim won a major cash prize (e.g. KBC 25 Lakhs) and demands upfront 'processing fee' or GST tax deposits."
        },
        "Parcel Scam": {
            "keywords": [
                "fedex", "customs clearance", "contraband", "impounded shipment", "parcel penalty",
                "international courier", "dhl", "clearance charges"
            ],
            "regex": r"(fedex|customs clearance|contraband|impounded|courier penalty|dhl)",
            "explanation": "High Severity Parcel / Logistics Scam Detected: Impersonates courier companies (FedEx/DHL) demanding fake Customs penalty payments for non-existent illegal shipments."
        },
        "Job Scam": {
            "keywords": [
                "youtube like job", "part-time job", "rating review task", "prepaid task",
                "telegram task", "daily 5000", "work from home", "google review job"
            ],
            "regex": r"(youtube like|part-time|rating review|prepaid task|telegram task|daily 5000|work from home)",
            "explanation": "Medium-High Severity Employment Task Scam Detected: Entices victims with easy part-time work (e.g. liking YouTube videos) before coercing them into paying high-value 'prepaid task' deposits."
        }
    }

    def detect_scam(self, text: str, source_type: str = "SMS") -> ScamDetectionResponse:
        text_clean = text.lower()
        matched_category = "Legitimate / Unclassified"
        highest_score = 0
        matched_keywords = []
        best_explanation = "No known cyber fraud pattern detected in text snippet."

        for category, info in self.PATTERNS.items():
            matches = [kw for kw in info["keywords"] if kw in text_clean]
            regex_hits = len(re.findall(info["regex"], text_clean, re.IGNORECASE))
            
            score = len(matches) * 20 + regex_hits * 15

            if score > highest_score:
                highest_score = score
                matched_category = category
                matched_keywords = matches
                best_explanation = info["explanation"]

        if highest_score == 0:
            return ScamDetectionResponse(
                scam_type="Low Risk / Clean Text",
                confidence=0.15,
                risk_score=10,
                suspicious_keywords=[],
                explanation="No recognized scam keywords or phishing tactics detected."
            )

        # Calculate Confidence & Risk Score
        confidence = min(0.50 + (highest_score * 0.05), 0.99)
        risk_score = min(40 + (highest_score * 4), 99)

        return ScamDetectionResponse(
            scam_type=matched_category,
            confidence=round(confidence, 2),
            risk_score=int(risk_score),
            suspicious_keywords=matched_keywords if matched_keywords else ["suspicious_pattern"],
            explanation=f"[{source_type.upper()} SCAN RESULT]: {best_explanation}"
        )

class LLMScamDetector(BaseScamDetector):
    """
    Placeholder LLM provider stub.
    Can be configured in the future to call Gemini Pro API / OpenAI GPT-4o / Ollama.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key

    def detect_scam(self, text: str, source_type: str = "SMS") -> ScamDetectionResponse:
        # Falls back to RuleBasedScamDetector if LLM API key is not configured
        fallback = RuleBasedScamDetector()
        return fallback.detect_scam(text, source_type)

# Default Global Scam Detector Engine instance
scam_detector_engine = RuleBasedScamDetector()



