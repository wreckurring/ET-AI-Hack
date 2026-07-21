import unittest
from app.services.graph_service import FraudGraphService
from app.schemas.schemas import GraphIngestRequest

class TestNeo4jGraphIntelligenceEngine(unittest.TestCase):

    def test_graph_ingest_payload(self):
        req = GraphIngestRequest(
            report_id=99,
            victim_name="Vikram Sethi",
            victim_phone="+91 98291 00211",
            amount_lost=250000.0,
            utr_number="402919481029",
            target_upi_id="cyber.scam@okicici",
            target_account_no="99401928401",
            target_ifsc="ICIC0000184",
            scammer_phone="+91 97182 44102",
            scammer_ip_address="45.132.227.10",
            device_imei="860492019481024",
            sim_iccid="8991048201948102948"
        )
        res = FraudGraphService.ingest_report_graph(req)
        self.assertIn("nodes", res)
        self.assertIn("edges", res)
        self.assertGreater(len(res["nodes"]), 0)

    def test_report_subgraph_query(self):
        res = FraudGraphService.get_report_subgraph(1)
        self.assertIn("nodes", res)
        self.assertIn("edges", res)

    def test_upi_network_query(self):
        res = FraudGraphService.get_upi_network("refund.sbi@okicici")
        self.assertIn("nodes", res)
        self.assertIn("edges", res)

    def test_phone_network_query(self):
        res = FraudGraphService.get_phone_network("+91 98351 90211")
        self.assertIn("nodes", res)
        self.assertIn("edges", res)

if __name__ == "__main__":
    unittest.main()
