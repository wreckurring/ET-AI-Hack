import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestHealthAndSecurityHardening(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_health_check_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)
        self.assertIn("services", data)
        self.assertIn("uptime_seconds", data)
        self.assertIn("postgres_database", data["services"])

    def test_api_v1_health_endpoint(self):
        response = self.client.get("/api/v1/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)

    def test_security_headers_and_request_id_tracing(self):
        response = self.client.get("/health", headers={"X-Request-ID": "TEST-REQ-12345"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("X-Request-ID"), "TEST-REQ-12345")
        self.assertEqual(response.headers.get("X-Content-Type-Options"), "nosniff")
        self.assertEqual(response.headers.get("X-Frame-Options"), "DENY")
        self.assertEqual(response.headers.get("X-XSS-Protection"), "1; mode=block")

    def test_swagger_documentation_endpoint(self):
        response = self.client.get("/docs")
        self.assertEqual(response.status_code, 200)

if __name__ == "__main__":
    unittest.main()
