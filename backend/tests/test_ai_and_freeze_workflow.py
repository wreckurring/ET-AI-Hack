import unittest
from app.services.scam_detector import RuleBasedScamDetector
from app.services.freeze_service import FastFreezeService
from app.schemas.schemas import FastFreezeCreate, FreezeStatusUpdateRequest
from app.core.database import SessionLocal, engine, Base
from app.models.postgres_models import FraudReport

class TestAIScamAndFastFreezeWorkflow(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    def setUp(self):
        self.db = SessionLocal()
        # Seed a dummy report if not present
        report = self.db.query(FraudReport).filter(FraudReport.id == 1).first()
        if not report:
            report = FraudReport(
                id=1,
                ack_number="RK-2026-TEST",
                victim_name="Test Victim",
                victim_phone="+91 98102 00000",
                victim_state="Delhi",
                victim_district="Delhi",
                category="Phishing Scam",
                amount_lost=185000.0,
                target_upi_id="refund.sbi@okicici",
                description="Test description",
                status="NEW",
                risk_score=90
            )
            self.db.add(report)
            self.db.commit()

    def tearDown(self):
        self.db.close()

    def test_ai_scam_detection_digital_arrest(self):
        text = "Sir this is Customs Officer from Mumbai Police. A package with 50g MDMA drugs was seized under your name. Connect on Skype for Digital Arrest clearance immediately."
        detector = RuleBasedScamDetector()
        res = detector.detect_scam(text, "SMS")
        self.assertEqual(res.scam_type, "Digital Arrest")
        self.assertGreaterEqual(res.confidence, 0.80)
        self.assertGreaterEqual(res.risk_score, 85)
        self.assertIn("digital arrest", [k.lower() for k in res.suspicious_keywords])

    def test_ai_scam_detection_kyc_fraud(self):
        text = "Your SBI YONO Account will be blocked today due to pending PAN card update. Click http://sbi-kyc.info to update or power cut will happen."
        detector = RuleBasedScamDetector()
        res = detector.detect_scam(text, "WHATSAPP")
        self.assertEqual(res.scam_type, "KYC Fraud")
        self.assertGreaterEqual(res.confidence, 0.70)

    def test_ai_scam_detection_investment_scam(self):
        text = "Join Telegram VIP stock signal group! Guaranteed 400% profit daily on institutional trading app."
        detector = RuleBasedScamDetector()
        res = detector.detect_scam(text, "EMAIL")
        self.assertEqual(res.scam_type, "Investment Scam")

    def test_ai_scam_detection_lottery_scam(self):
        text = "Congratulations! KBC Kaun Banega Crorepati lucky draw winner of 25 Lakhs cash prize. Deposit processing fee tax."
        detector = RuleBasedScamDetector()
        res = detector.detect_scam(text, "SMS")
        self.assertEqual(res.scam_type, "Lottery Scam")

    def test_ai_scam_detection_parcel_scam(self):
        text = "FedEx shipment impounded by Customs. Pay contraband clearance penalty charges."
        detector = RuleBasedScamDetector()
        res = detector.detect_scam(text, "EMAIL")
        self.assertEqual(res.scam_type, "Parcel Scam")

    def test_ai_scam_detection_job_scam(self):
        text = "Part-time YouTube like video job. Earn daily 5000 via Telegram rating review task."
        detector = RuleBasedScamDetector()
        res = detector.detect_scam(text, "WHATSAPP")
        self.assertEqual(res.scam_type, "Job Scam")

    def test_fast_freeze_state_workflow_and_audit(self):
        freeze_req = FastFreezeCreate(
            report_id=1,
            target_identifier="refund.sbi@okicici",
            beneficiary_bank="State Bank of India",
            amount_held=185000.0,
            police_badge="INSP-8821",
            notes="Section 91 CrPC Hold Directive"
        )
        action = FastFreezeService.create_freeze_request(self.db, freeze_req)
        self.assertTrue(action.action_reference.startswith("FF-2026-"))
        self.assertEqual(action.freeze_status, "ACCOUNT_FROZEN")
        self.assertGreaterEqual(len(action.audit_logs), 5)

        # Check Audit Log Timeline sequence
        states_sequence = [log.to_state for log in action.audit_logs]
        self.assertIn("PENDING", states_sequence)
        self.assertIn("UNDER_REVIEW", states_sequence)
        self.assertIn("FREEZE_REQUESTED", states_sequence)
        self.assertIn("BANK_ACKNOWLEDGED", states_sequence)
        self.assertIn("ACCOUNT_FROZEN", states_sequence)

if __name__ == "__main__":
    unittest.main()
