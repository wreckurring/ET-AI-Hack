import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestCounterfeitAndUnifiedDashboard(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_counterfeit_report_creation(self):
        payload = {
            "denomination": 500,
            "serial_number": "7AK991029",
            "state": "West Bengal",
            "district": "Malda",
            "seizure_location": "Benapole Border Transit Checkpoint",
            "suspected_source": "Fake Currency Smuggling Network",
            "fake_notes_count": 250,
            "reporting_agency": "BSF / State Cyber Cell"
        }
        res = self.client.post("/api/v1/counterfeit/report", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertIn("ack_number", data)
        self.assertTrue(data["ack_number"].startswith("FICN-2026-"))
        self.assertEqual(data["denomination"], 500)

    def test_counterfeit_analytics(self):
        res = self.client.get("/api/v1/counterfeit/analytics")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("total_ficn_seizures", data)
        self.assertIn("top_affected_states", data)

    def test_unified_dashboard_summary(self):
        res = self.client.get("/api/v1/analytics/dashboard/summary")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("active_complaints", data)
        self.assertIn("predicted_threats_count", data)
        self.assertIn("counterfeit_alerts_count", data)
        self.assertIn("ai_risk_score", data)

if __name__ == "__main__":
    unittest.main()
