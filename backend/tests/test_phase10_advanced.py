import unittest
import asyncio
from app.services.ocr_service import OCREvidenceAnalyzer
from app.services.voice_service import VoiceScamAnalyzer
from app.services.investigation_copilot import investigation_copilot
from app.services.pdf_generator import PDFCaseReportGenerator
from app.services.predictive_risk import PredictiveRiskEngine
from app.core.websocket_manager import ws_manager
from app.core.database import SessionLocal, engine, Base

class TestPhase10AdvancedCapabilities(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_ocr_evidence_analysis(self):
        fake_image_bytes = b"MUMBAI POLICE DIGITAL ARREST NOTICE. Package containing 50g MDMA seized. Connect on Skype video call."
        res = OCREvidenceAnalyzer.analyze_ocr_evidence(fake_image_bytes, "test_notice.png")
        self.assertEqual(res["scam_type"], "Digital Arrest")
        self.assertGreaterEqual(res["confidence"], 0.80)
        self.assertGreaterEqual(res["risk_score"], 85)
        self.assertIn("extracted_text", res)

    def test_voice_scam_analysis(self):
        fake_audio_bytes = b"Hello this is Senior Officer from Cyberabad Police. Your bank account is linked to illegal money laundering. Download APK app and update your KYC or account block will happen."
        res = VoiceScamAnalyzer.analyze_voice_call(fake_audio_bytes, "test_call.wav")
        self.assertIn("transcript", res)
        self.assertGreaterEqual(res["risk_score"], 70)

    def test_ai_investigation_copilot(self):
        brief = investigation_copilot.generate_investigation_brief(self.db, 1)
        self.assertIn("case_summary", brief)
        self.assertIn("classification_explanation", brief)
        self.assertGreaterEqual(len(brief["investigation_recommendations"]), 3)
        self.assertIn("generated_officer_notes", brief)

    def test_pdf_case_report_generator(self):
        pdf_bytes = PDFCaseReportGenerator.generate_case_pdf_bytes(self.db, 1)
        self.assertIsInstance(pdf_bytes, bytes)
        self.assertGreater(len(pdf_bytes), 200)
        self.assertIn(b"RAKSHA-NET: AI CYBER FRAUD INTELLIGENCE PLATFORM", pdf_bytes)

    def test_predictive_risk_intelligence(self):
        predictions = PredictiveRiskEngine.calculate_predictive_risk(self.db)
        self.assertIn("high_risk_districts", predictions)
        self.assertIn("emerging_scam_trends", predictions)
        self.assertIn("repeat_mule_accounts", predictions)

    def test_websocket_broadcast(self):
        async def run_ws_broadcast():
            await ws_manager.broadcast_notification("TEST_EVENT", {"status": "SUCCESS"})
        asyncio.run(run_ws_broadcast())

if __name__ == "__main__":
    unittest.main()
