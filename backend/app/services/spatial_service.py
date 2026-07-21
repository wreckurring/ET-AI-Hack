import math
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.postgres_models import FraudReport

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates approximate distance between two lat/lon points in kilometers using Haversine formula."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         (math.sin(dlon / 2) ** 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class SpatialAnalyticsService:

    @staticmethod
    def dbscan_clustering(points: List[Dict[str, Any]], eps_km: float = 75.0, min_samples: int = 1) -> List[Dict[str, Any]]:
        """
        DBSCAN Spatial Clustering Algorithm (Haversine Distance).
        Groups geographic points into spatial clusters based on proximity (eps_km) and density (min_samples).
        """
        n = len(points)
        labels = [-1] * n # -1 represents unvisited / noise
        cluster_id = 0

        def get_neighbors(index: int) -> List[int]:
            p1 = points[index]
            neighbors = []
            for j, p2 in enumerate(points):
                dist = haversine_distance(p1["lat"], p1["lng"], p2["lat"], p2["lng"])
                if dist <= eps_km:
                    neighbors.append(j)
            return neighbors

        for i in range(n):
            if labels[i] != -1:
                continue

            neighbors = get_neighbors(i)
            if len(neighbors) < min_samples:
                labels[i] = -1 # Noise
            else:
                labels[i] = cluster_id
                # Expand cluster
                seeds = list(neighbors)
                seeds.remove(i)
                for seed in seeds:
                    if labels[seed] == -1:
                        labels[seed] = cluster_id
                    if labels[seed] != -1:
                        continue
                    labels[seed] = cluster_id
                    seed_neighbors = get_neighbors(seed)
                    if len(seed_neighbors) >= min_samples:
                        seeds.extend(seed_neighbors)
                cluster_id += 1

        # Group points by assigned cluster_id
        clusters_dict = {}
        for idx, cid in enumerate(labels):
            if cid not in clusters_dict:
                clusters_dict[cid] = []
            clusters_dict[cid].append(points[idx])

        return clusters_dict

    @staticmethod
    def get_geojson_hotspots(db: Session) -> Dict[str, Any]:
        """
        Queries all spatial reports from PostgreSQL and formats into a GeoJSON FeatureCollection.
        """
        reports = db.query(FraudReport).all()
        
        # Default rich spatial datasets if database has few reports
        if len(reports) < 4:
            default_points = SpatialAnalyticsService._get_default_spatial_dataset()
        else:
            default_points = [
                {
                    "id": r.id,
                    "district": r.victim_district,
                    "state": r.victim_state,
                    "lat": r.latitude or 28.6139,
                    "lng": r.longitude or 77.2090,
                    "amount": r.amount_lost,
                    "ack": r.ack_number,
                    "category": r.category
                } for r in reports
            ]

        features = []
        for pt in default_points:
            risk_level = "CRITICAL" if pt["amount"] > 300000 else "HIGH" if pt["amount"] > 100000 else "MEDIUM"
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [pt["lng"], pt["lat"]]
                },
                "properties": {
                    "id": pt["id"],
                    "district": pt["district"],
                    "state": pt["state"],
                    "amount_lost": pt["amount"],
                    "ack_number": pt.get("ack", "RK-2026-0000"),
                    "category": pt.get("category", "Cyber Fraud"),
                    "risk_level": risk_level
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    @staticmethod
    def get_geojson_clusters(db: Session) -> Dict[str, Any]:
        """
        Performs DBSCAN spatial clustering on report points and returns GeoJSON FeatureCollection of clusters.
        """
        reports = db.query(FraudReport).all()
        if len(reports) < 4:
            points = SpatialAnalyticsService._get_default_spatial_dataset()
        else:
            points = [
                {
                    "id": r.id,
                    "district": r.victim_district,
                    "state": r.victim_state,
                    "lat": r.latitude or 28.6139,
                    "lng": r.longitude or 77.2090,
                    "amount": r.amount_lost,
                    "ack": r.ack_number
                } for r in reports
            ]

        clustered_data = SpatialAnalyticsService.dbscan_clustering(points, eps_km=80.0, min_samples=1)
        cluster_features = []

        for cid, pt_list in clustered_data.items():
            avg_lat = sum(p["lat"] for p in pt_list) / len(pt_list)
            avg_lng = sum(p["lng"] for p in pt_list) / len(pt_list)
            total_loss = sum(p["amount"] for p in pt_list)
            count = len(pt_list)
            district = pt_list[0]["district"]
            state = pt_list[0]["state"]
            risk_level = "CRITICAL" if total_loss > 3000000 or count > 5 else "HIGH"

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [avg_lng, avg_lat]
                },
                "properties": {
                    "cluster_id": cid,
                    "district": district,
                    "state": state,
                    "incident_count": count,
                    "total_amount_loss": total_loss,
                    "risk_level": risk_level,
                    "member_reports": [p.get("ack", "") for p in pt_list]
                }
            }
            cluster_features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": cluster_features
        }

    @staticmethod
    def get_geojson_heatmap(db: Session) -> Dict[str, Any]:
        """
        Returns GeoJSON FeatureCollection of weighted spatial intensity points for Leaflet heatmap.
        """
        reports = db.query(FraudReport).all()
        if len(reports) < 4:
            points = SpatialAnalyticsService._get_default_spatial_dataset()
        else:
            points = [
                {
                    "lat": r.latitude or 28.6139,
                    "lng": r.longitude or 77.2090,
                    "amount": r.amount_lost,
                    "district": r.victim_district
                } for r in reports
            ]

        heatmap_features = []
        for pt in points:
            weight = round(pt["amount"] / 100000.0, 2)
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [pt["lng"], pt["lat"]]
                },
                "properties": {
                    "intensity_weight": weight,
                    "district": pt["district"],
                    "amount": pt["amount"]
                }
            }
            heatmap_features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": heatmap_features
        }

    @staticmethod
    def _get_default_spatial_dataset() -> List[Dict[str, Any]]:
        return [
            {"id": 1, "district": "Jamtara", "state": "Jharkhand", "lat": 23.9632, "lng": 86.8024, "amount": 4850000.0, "ack": "RK-2026-8801", "category": "Phishing Scam"},
            {"id": 2, "district": "Mewat (Nuh)", "state": "Haryana", "lat": 28.1023, "lng": 77.0142, "amount": 3210000.0, "ack": "RK-2026-8802", "category": "OLX Fake Army Officer"},
            {"id": 3, "district": "Delhi NCR", "state": "Delhi", "lat": 28.6139, "lng": 77.2090, "amount": 9540000.0, "ack": "RK-2026-8803", "category": "Phishing Scam"},
            {"id": 4, "district": "Cyberabad", "state": "Telangana", "lat": 17.4435, "lng": 78.3772, "amount": 2900000.0, "ack": "RK-2026-8804", "category": "UPI Fraud"},
            {"id": 5, "district": "Bengaluru Urban", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946, "amount": 6200000.0, "ack": "RK-2026-8805", "category": "FedEx Digital Arrest"},
            {"id": 6, "district": "Mumbai Suburban", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777, "amount": 7800000.0, "ack": "RK-2026-8806", "category": "Telegram Investment Scam"},
            {"id": 7, "district": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639, "amount": 2100000.0, "ack": "RK-2026-8807", "category": "Phishing Scam"},
            {"id": 8, "district": "Deoghar", "state": "Jharkhand", "lat": 24.4826, "lng": 86.6997, "amount": 1950000.0, "ack": "RK-2026-8808", "category": "Mule Account Hub"}
        ]
