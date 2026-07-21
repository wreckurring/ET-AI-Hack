from typing import List, Dict, Any

class GeoJSONFormatter:
    """Utility service for converting spatial point & polygon records into GeoJSON FeatureCollection format."""

    @staticmethod
    def format_points_to_feature_collection(points: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Converts a list of dicts containing lat, lng, and properties into a standard GeoJSON FeatureCollection.
        """
        features = []
        for p in points:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(p.get("lng", 77.2090)), float(p.get("lat", 28.6139))]
                },
                "properties": {
                    "id": p.get("id"),
                    "ack_number": p.get("ack_number", ""),
                    "district": p.get("district", "Unknown"),
                    "state": p.get("state", "Unknown"),
                    "category": p.get("category", "Cyber Fraud"),
                    "amount_lost": float(p.get("amount_lost", 0.0)),
                    "risk_score": p.get("risk_score", 75),
                    "risk_level": p.get("risk_level", "HIGH"),
                    "status": p.get("status", "NEW"),
                    "is_frozen": p.get("is_frozen", False),
                    "created_at": str(p.get("created_at", ""))
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    @staticmethod
    def format_clusters_to_feature_collection(clusters: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Converts DBSCAN spatial cluster objects into GeoJSON FeatureCollection format.
        """
        features = []
        for c in clusters:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(c.get("lng", 77.2090)), float(c.get("lat", 28.6139))]
                },
                "properties": {
                    "cluster_id": c.get("cluster_id"),
                    "district": c.get("district", "Hotspot Region"),
                    "state": c.get("state", "India"),
                    "incident_count": c.get("incident_count", 1),
                    "total_amount_loss": float(c.get("total_amount_loss", 0.0)),
                    "dominant_scam_category": c.get("dominant_scam_category", "Phishing Scam"),
                    "density_score": c.get("density_score", 85),
                    "risk_level": c.get("risk_level", "CRITICAL"),
                    "last_reported": str(c.get("last_reported", ""))
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }

    @staticmethod
    def format_heatmap_to_feature_collection(points: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Converts weighted point records into GeoJSON FeatureCollection format for Leaflet Heatmap rendering.
        """
        features = []
        for p in points:
            amount = float(p.get("amount_lost", 0.0))
            weight = round(max(amount / 100000.0, 0.5), 2)
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(p.get("lng", 77.2090)), float(p.get("lat", 28.6139))]
                },
                "properties": {
                    "intensity_weight": weight,
                    "district": p.get("district", ""),
                    "amount_lost": amount
                }
            }
            features.append(feature)

        return {
            "type": "FeatureCollection",
            "features": features
        }
