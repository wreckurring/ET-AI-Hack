from fastapi import APIRouter, Depends, HTTPException, status
from app.services.graph_service import FraudGraphService
from app.schemas.schemas import GraphIngestRequest, NetworkGraphResponse, HTTPErrorDetail
import urllib.parse

router = APIRouter(prefix="/graph", tags=["Neo4j Graph Intelligence Engine"])

@router.post(
    "/ingest",
    response_model=NetworkGraphResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": HTTPErrorDetail, "description": "Invalid entity parameters"}
    }
)
def ingest_fraud_graph_record(req: GraphIngestRequest):
    """
    Ingest a new fraud report entity structure into Neo4j graph database via atomic Cypher MERGE queries.
    Creates Nodes: Victim, Phone Number, SIM, Device, UPI, Bank Account, IFSC, Transaction, IP Address.
    Creates Relationships: TRANSFERRED_TO, SENT_TO, CONNECTED_TO, USED_BY, CALLED_FROM, LOGIN_FROM.
    Returns updated Vis.js network graph payload.
    """
    try:
        return FraudGraphService.ingest_report_graph(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Neo4j Cypher Ingestion error: {str(e)}"
        )

@router.get(
    "/report/{report_id}",
    response_model=NetworkGraphResponse,
    responses={
        404: {"model": HTTPErrorDetail, "description": "Report subgraph not found"}
    }
)
def get_subgraph_by_report(report_id: int):
    """
    Cypher Query Endpoint: Returns all nodes and relationships connected to a specific report transaction ID.
    """
    return FraudGraphService.get_report_subgraph(report_id)

@router.get(
    "/network/upi/{upi_handle:path}",
    response_model=NetworkGraphResponse
)
def get_network_by_upi(upi_handle: str):
    """
    Cypher Query Endpoint: Traverses 2-hop financial networks connected to a target UPI handle (e.g. refund.sbi@okicici).
    """
    decoded_upi = urllib.parse.unquote(upi_handle)
    return FraudGraphService.get_upi_network(decoded_upi)

@router.get(
    "/network/phone/{phone_number:path}",
    response_model=NetworkGraphResponse
)
def get_network_by_phone(phone_number: str):
    """
    Cypher Query Endpoint: Traverses 2-hop calling, SIM, device, and host IP networks connected to a scammer Phone Number.
    """
    decoded_phone = urllib.parse.unquote(phone_number)
    return FraudGraphService.get_phone_network(decoded_phone)

@router.get(
    "/network",
    response_model=NetworkGraphResponse
)
def get_global_fraud_network():
    """
    Returns complete Neo4j Graph Network payload containing Nodes & Relationships for Vis.js canvas visualization.
    """
    return FraudGraphService.get_full_fraud_network()
