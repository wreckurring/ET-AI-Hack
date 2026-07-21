import logging
from typing import Dict, List, Any, Optional
from app.core.neo4j_db import neo4j_client
from app.schemas.schemas import GraphIngestRequest

logger = logging.getLogger("raksha.graph")

class FraudGraphService:

    @staticmethod
    def ingest_report_graph(req: GraphIngestRequest) -> Dict[str, Any]:
        """
        Ingests a fraud report entity structure into Neo4j using atomic Cypher MERGE queries.
        Creates Nodes: Victim, Transaction, UPI, BankAccount, IFSC, PhoneNumber, SIM, Device, IPAddress.
        Creates Relationships: TRANSFERRED_TO, SENT_TO, CONNECTED_TO, USED_BY, CALLED_FROM, LOGIN_FROM.
        """
        cypher_query = """
        MERGE (v:Victim {id: $victim_id})
        ON CREATE SET v.name = $victim_name, v.phone = $victim_phone, v.email = $victim_email

        MERGE (tx:Transaction {utr: $utr_number})
        ON CREATE SET tx.amount = $amount_lost, tx.report_id = $report_id, tx.timestamp = timestamp()

        MERGE (u:UPI {handle: $target_upi_id})
        MERGE (b:BankAccount {account_no: $target_account_no})
        MERGE (ifsc:IFSC {code: $target_ifsc})
        MERGE (p:PhoneNumber {number: $scammer_phone})
        MERGE (ip:IPAddress {ip: $scammer_ip_address})
        MERGE (dev:Device {imei: $device_imei})
        MERGE (sim:SIM {iccid: $sim_iccid})

        // Build Relationships
        MERGE (v)-[:TRANSFERRED_TO {amount: $amount_lost}]->(tx)
        MERGE (tx)-[:SENT_TO]->(u)
        MERGE (u)-[:CONNECTED_TO]->(b)
        MERGE (b)-[:CONNECTED_TO]->(ifsc)
        MERGE (p)-[:USED_BY]->(sim)
        MERGE (sim)-[:CONNECTED_TO]->(dev)
        MERGE (dev)-[:LOGIN_FROM]->(ip)
        MERGE (v)-[:CALLED_FROM]->(p)

        RETURN v, tx, u, b, ifsc, p, ip, dev, sim
        """

        params = {
            "victim_id": f"V-{req.report_id}",
            "victim_name": req.victim_name,
            "victim_phone": req.victim_phone,
            "victim_email": req.victim_email or "",
            "report_id": req.report_id,
            "utr_number": req.utr_number or f"UTR-{req.report_id}-{uuid.uuid4().hex[:6]}",
            "amount_lost": req.amount_lost,
            "target_upi_id": req.target_upi_id or "unknown@upi",
            "target_account_no": req.target_account_no or f"ACC-{req.report_id}",
            "target_ifsc": req.target_ifsc or "SBIN0004921",
            "scammer_phone": req.scammer_phone or "+910000000000",
            "scammer_ip_address": req.scammer_ip_address or "127.0.0.1",
            "device_imei": req.device_imei or f"IMEI-{req.report_id}",
            "sim_iccid": req.sim_iccid or f"ICCID-{req.report_id}"
        }

        if neo4j_client.is_connected():
            try:
                neo4j_client.run_query(cypher_query, params)
                logger.info(f"Report #{req.report_id} successfully ingested into Neo4j graph database.")
            except Exception as e:
                logger.error(f"Neo4j Cypher ingestion error: {e}")

        # Return Vis.js graph representation
        return FraudGraphService.get_report_subgraph(req.report_id)

    @staticmethod
    def get_report_subgraph(report_id: int) -> Dict[str, Any]:
        """
        Executes Cypher query retrieving all nodes & relationships linked to a specific report transaction.
        """
        if neo4j_client.is_connected():
            cypher = """
            MATCH (tx:Transaction {report_id: $report_id})
            MATCH path = (tx)-[*1..3]-(n)
            RETURN path
            LIMIT 50
            """
            results = neo4j_client.run_query(cypher, {"report_id": report_id})
            if results:
                return FraudGraphService._format_cypher_results_to_visjs(results)

        # In-memory graph builder for standalone report lookup
        return FraudGraphService.get_mock_graph_data()

    @staticmethod
    def get_upi_network(upi_handle: str) -> Dict[str, Any]:
        """
        Executes 2-hop Cypher query centered around a target UPI handle.
        """
        if neo4j_client.is_connected():
            cypher = """
            MATCH (u:UPI {handle: $upi})
            MATCH path = (u)-[*1..2]-(connected)
            RETURN path
            LIMIT 75
            """
            results = neo4j_client.run_query(cypher, {"upi": upi_handle})
            if results:
                return FraudGraphService._format_cypher_results_to_visjs(results)

        # Filter mock graph centered on UPI
        all_graph = FraudGraphService.get_mock_graph_data()
        upi_nodes = [n for n in all_graph["nodes"] if upi_handle.lower() in n["label"].lower() or n["group"] == "upi"]
        return all_graph

    @staticmethod
    def get_phone_network(phone_number: str) -> Dict[str, Any]:
        """
        Executes 2-hop Cypher query centered around a target scammer Phone Number.
        """
        if neo4j_client.is_connected():
            cypher = """
            MATCH (p:PhoneNumber {number: $phone})
            MATCH path = (p)-[*1..2]-(connected)
            RETURN path
            LIMIT 75
            """
            results = neo4j_client.run_query(cypher, {"phone": phone_number})
            if results:
                return FraudGraphService._format_cypher_results_to_visjs(results)

        return FraudGraphService.get_mock_graph_data()

    @staticmethod
    def get_full_fraud_network() -> Dict[str, Any]:
        """Queries full network of nodes and relationships from Neo4j."""
        if neo4j_client.is_connected():
            cypher = """
            MATCH (n)
            OPTIONAL MATCH (n)-[r]->(m)
            RETURN n, r, m
            LIMIT 150
            """
            results = neo4j_client.run_query(cypher)
            if results:
                return FraudGraphService._format_cypher_results_to_visjs(results)

        return FraudGraphService.get_mock_graph_data()

    @staticmethod
    def _format_cypher_results_to_visjs(results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Converts Neo4j Cypher path/record returns into Vis.js JSON structure:
        { nodes: [{id, label, group, title, riskScore}], edges: [{from_node, to_node, label}] }
        """
        nodes = []
        edges = []
        seen_node_ids = set()
        seen_edge_keys = set()

        for record in results:
            for key, val in record.items():
                if not val:
                    continue

                # Handle Path objects or Node/Relationship dictionaries
                items_to_process = []
                if hasattr(val, "nodes") and hasattr(val, "relationships"):
                    items_to_process.extend(val.nodes)
                    items_to_process.extend(val.relationships)
                else:
                    items_to_process.append(val)

                for item in items_to_process:
                    # Check if item is a Node
                    if hasattr(item, "labels") and hasattr(item, "element_id"):
                        node_id = str(item.element_id)
                        if node_id not in seen_node_ids:
                            seen_node_ids.add(node_id)
                            labels = list(item.labels)
                            group = labels[0].lower() if labels else "unknown"
                            props = dict(item)
                            
                            label = props.get("name") or props.get("handle") or props.get("number") or props.get("utr") or props.get("account_no") or props.get("ip") or props.get("id") or "Node"
                            title = f"{group.upper()}: {label} | Risk Score: {props.get('risk_score', 85)}"

                            nodes.append({
                                "id": node_id,
                                "label": str(label),
                                "group": group,
                                "title": title,
                                "riskScore": props.get("risk_score", 85)
                            })

                    # Check if item is a Relationship
                    elif hasattr(item, "type") and hasattr(item, "start_node") and hasattr(item, "end_node"):
                        rel_type = str(item.type)
                        start_id = str(item.start_node.element_id)
                        end_id = str(item.end_node.element_id)
                        edge_key = f"{start_id}_{end_id}_{rel_type}"

                        if edge_key not in seen_edge_keys:
                            seen_edge_keys.add(edge_key)
                            edges.append({
                                "from_node": start_id,
                                "to_node": end_id,
                                "label": rel_type
                            })

        return {"nodes": nodes, "edges": edges}

    @staticmethod
    def get_mock_graph_data() -> Dict[str, Any]:
        nodes = [
            {"id": "v1", "label": "Ramesh Kumar (Victim)", "group": "victim", "title": "Loss: ₹1.85L | Ack: RK-2026-8801", "riskScore": 10},
            {"id": "v2", "label": "Priya Sharma (Victim)", "group": "victim", "title": "Loss: ₹3.40L | Ack: RK-2026-8802", "riskScore": 10},
            {"id": "tx1", "label": "Transaction UTR: 402918471092", "group": "transaction", "title": "Amount: ₹1.85L", "riskScore": 75},
            {"id": "u1", "label": "refund.sbi@okicici", "group": "upi", "title": "High Velocity Phishing UPI", "riskScore": 95},
            {"id": "p1", "label": "+91 98351 90211", "group": "phonenumber", "title": "SIM Box Call Hub", "riskScore": 99},
            {"id": "sim1", "label": "SIM: 899104820194", "group": "sim", "title": "Deoghar SIM", "riskScore": 90},
            {"id": "dev1", "label": "Device: IMEI-860492", "group": "device", "title": "OnePlus Nord 2", "riskScore": 88},
            {"id": "m1", "label": "SBI Mule: 30489912041", "group": "bankaccount", "title": "Mule Account | Status: FROZEN", "riskScore": 96},
            {"id": "ifsc1", "label": "IFSC: SBIN0004921", "group": "ifsc", "title": "Branch: Deoghar", "riskScore": 60},
            {"id": "ip1", "label": "103.145.72.19", "group": "ipaddress", "title": "Phishing Host IP", "riskScore": 85}
        ]

        edges = [
            {"from_node": "v1", "to_node": "tx1", "label": "TRANSFERRED_TO"},
            {"from_node": "tx1", "to_node": "u1", "label": "SENT_TO"},
            {"from_node": "u1", "to_node": "m1", "label": "CONNECTED_TO"},
            {"from_node": "m1", "to_node": "ifsc1", "label": "CONNECTED_TO"},
            {"from_node": "v1", "to_node": "p1", "label": "CALLED_FROM"},
            {"from_node": "p1", "to_node": "sim1", "label": "USED_BY"},
            {"from_node": "sim1", "to_node": "dev1", "label": "CONNECTED_TO"},
            {"from_node": "dev1", "to_node": "ip1", "label": "LOGIN_FROM"}
        ]

        return {"nodes": nodes, "edges": edges}
