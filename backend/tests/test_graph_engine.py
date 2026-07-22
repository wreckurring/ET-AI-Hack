import unittest
from app.services.graph_service import FraudGraphService
from app.schemas.schemas import GraphIngestRequest
from app.core.database import SessionLocal, engine, Base

class TestNeo4jGraphEngine(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_graph_ingest_payload(self):
        req = GraphIngestRequest(
            report_id=99,
            victim_id="V-99",
            victim_name="Test Victim",
            victim_phone="+919810200000",
            victim_email="victim@test.com",
            utr_number="UTR-99",
            amount_lost=15000.0,
            target_upi_id="fraud@okaxis",
            target_account_no="990011",
            target_ifsc="UTIB000001",
            scammer_phone="+919835190211",
            scammer_ip_address="103.22.102.41",
            device_imei="860192840192840",
            sim_iccid="899102941029410294"
        )
        res = FraudGraphService.ingest_report_graph(req)
        self.assertIn("nodes", res)
        self.assertIn("edges", res)

    def test_get_report_graph_visjs(self):
        graph_data = FraudGraphService.get_report_subgraph(99)
        self.assertIn("nodes", graph_data)
        self.assertIn("edges", graph_data)

    def test_get_network_graph_by_upi(self):
        graph_data = FraudGraphService.get_upi_network("refund.sbi@okicici")
        self.assertIn("nodes", graph_data)
        self.assertIn("edges", graph_data)

    def test_get_network_graph_by_phone(self):
        graph_data = FraudGraphService.get_phone_network("+919835190211")
        self.assertIn("nodes", graph_data)
        self.assertIn("edges", graph_data)

if __name__ == "__main__":
    unittest.main()
