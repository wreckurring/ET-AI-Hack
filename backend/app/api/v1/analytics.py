from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.spatial.spatial_queries import PostGISQueriesService
from app.services.spatial.spatial_aggregations import SpatialAggregationsService
from app.services.spatial.geojson_formatter import GeoJSONFormatter
from app.services.spatial.dashboard_stats import DashboardStatsService

router = APIRouter(prefix="/analytics", tags=["PostGIS Spatial Intelligence & Police Analytics"])

@router.get("/hotspots")
def get_spatial_hotspots(
    state: Optional[str] = Query(None, description="Filter by State (e.g. Delhi, Haryana, Jharkhand)"),
    district: Optional[str] = Query(None, description="Filter by District (e.g. Jamtara, Mewat)"),
    category: Optional[str] = Query(None, description="Filter by Scam Category (e.g. Phishing Scam)"),
    min_risk_score: Optional[int] = Query(None, description="Filter minimum AI risk score (0-100)"),
    is_frozen: Optional[bool] = Query(None, description="Filter by Fast-Freeze status"),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns standard GeoJSON FeatureCollection of PostGIS spatial incident points & district aggregates.
    Supports multi-filtering by State, District, Scam Category, Risk Score, and Fast-Freeze Status.
    """
    filters = {
        "state": state,
        "district": district,
        "category": category,
        "min_risk_score": min_risk_score,
        "is_frozen": is_frozen
    }
    points = PostGISQueriesService.get_spatial_points(db, filters)
    return GeoJSONFormatter.format_points_to_feature_collection(points)

@router.get("/clusters")
def get_spatial_dbscan_clusters(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_risk_score: Optional[int] = Query(None),
    is_frozen: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Executes PostGIS ST / DBSCAN Spatial Clustering algorithm on report coordinates.
    Returns GeoJSON FeatureCollection of spatial density clusters containing:
    - Cluster Centroid (Latitude / Longitude)
    - Incident Count & Total Fraud Monetary Loss (INR)
    - Dominant Scam Category & Last Reported Timestamp
    - Density Risk Score & Risk Index
    """
    filters = {
        "state": state,
        "district": district,
        "category": category,
        "min_risk_score": min_risk_score,
        "is_frozen": is_frozen
    }
    clusters = PostGISQueriesService.dbscan_hotspot_clusters(db, filters, eps_km=75.0, min_samples=1)
    return GeoJSONFormatter.format_clusters_to_feature_collection(clusters)

@router.get("/heatmap")
def get_spatial_heatmap(
    state: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns GeoJSON FeatureCollection of weighted spatial intensity points for Leaflet Heatmap rendering.
    """
    filters = {"state": state, "category": category}
    points = PostGISQueriesService.get_spatial_points(db, filters)
    return GeoJSONFormatter.format_heatmap_to_feature_collection(points)

@router.get("/states")
def get_state_analytics_breakdown(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Returns State-wise breakdown of incident counts, total monetary loss, and dominant scam category.
    """
    filters = {"category": category}
    return SpatialAggregationsService.get_state_breakdown(db, filters)

@router.get("/districts")
def get_district_analytics_breakdown(
    state: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Returns District-wise breakdown of incident counts, total monetary loss, and risk level.
    """
    filters = {"state": state}
    return SpatialAggregationsService.get_district_breakdown(db, filters)

@router.get("/telemetry")
def get_dashboard_telemetry(db: Session = Depends(get_db)):
    """Returns live top-level KPIs for Police Command Center."""
    return DashboardStatsService.get_command_center_kpis(db)

from app.services.predictive_risk import PredictiveRiskEngine

@router.get("/predictive-risk")
def get_predictive_risk_analytics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Returns Predictive Risk Forecasting metrics for Police Command Center:
    - High-Risk Geographic Districts & Trend Escalation
    - Emerging Scam Taxonomy Trends
    - Repeat Mule Bank Accounts & Velocity Ratings
    - Repeat Scammer Phone SIM Numbers
    - High-Risk Target UPI Handles
    """
    return PredictiveRiskEngine.calculate_predictive_risk(db)
    """
    Returns full Police Analytics Dashboard dataset:
    - Live KPI Cards (Total Incidents, Total Loss, Active Hotspots, Fraud Recovery, Golden Hour Freeze Success %, Avg Response Time)
    - Scam Category Distribution
    - Daily & Monthly Trends
    - State-wise & District-wise Breakdowns
    - Top Fraud UPI Handles Table
    - Top Scammer Phone Numbers Table
    """
    kpis = DashboardStatsService.get_command_center_kpis(db)
    scam_distribution = SpatialAggregationsService.get_scam_category_distribution(db)
    trends = DashboardStatsService.get_daily_monthly_trends(db)
    states = SpatialAggregationsService.get_state_breakdown(db)
    districts = SpatialAggregationsService.get_district_breakdown(db)
    top_upis = SpatialAggregationsService.get_top_threat_upi_ids(db)
    top_phones = SpatialAggregationsService.get_top_scammer_phone_numbers(db)

    return {
        "kpis": kpis,
        "scam_distribution": scam_distribution,
        "daily_trend": trends["daily_trend"],
        "monthly_trend": trends["monthly_trend"],
        "state_breakdown": states,
        "district_breakdown": districts,
        "top_fraud_upis": top_upis,
        "top_scammer_phones": top_phones
    }
