import unittest
from app.services.spatial.spatial_queries import PostGISQueriesService
from app.services.spatial.spatial_aggregations import SpatialAggregationsService
from app.services.spatial.geojson_formatter import GeoJSONFormatter
from app.services.spatial.dashboard_stats import DashboardStatsService
from app.core.database import SessionLocal, engine, Base

class TestPostGISSpatialAnalytics(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_spatial_points_retrieval(self):
        points = PostGISQueriesService.get_spatial_points(self.db)
        self.assertIsInstance(points, list)
        self.assertGreater(len(points), 0)
        self.assertIn("lat", points[0])
        self.assertIn("lng", points[0])

    def test_dbscan_hotspot_clusters(self):
        clusters = PostGISQueriesService.dbscan_hotspot_clusters(self.db, eps_km=75.0, min_samples=1)
        self.assertIsInstance(clusters, list)
        self.assertGreater(len(clusters), 0)
        self.assertIn("dominant_scam_category", clusters[0])

    def test_geojson_formatting(self):
        points = PostGISQueriesService.get_spatial_points(self.db)
        geojson = GeoJSONFormatter.format_points_to_feature_collection(points)
        self.assertEqual(geojson["type"], "FeatureCollection")
        self.assertIn("features", geojson)
        self.assertGreater(len(geojson["features"]), 0)
        self.assertEqual(geojson["features"][0]["geometry"]["type"], "Point")

    def test_state_and_district_aggregations(self):
        states = SpatialAggregationsService.get_state_breakdown(self.db)
        districts = SpatialAggregationsService.get_district_breakdown(self.db)
        self.assertGreater(len(states), 0)
        self.assertGreater(len(districts), 0)

    def test_command_center_telemetry_kpis(self):
        kpis = DashboardStatsService.get_command_center_kpis(self.db)
        self.assertIn("total_incidents", kpis)
        self.assertIn("total_amount_loss", kpis)
        self.assertIn("golden_hour_freeze_success_pct", kpis)
        self.assertIn("avg_response_time_minutes", kpis)

if __name__ == "__main__":
    unittest.main()
