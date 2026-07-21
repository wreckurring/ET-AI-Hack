import unittest
from app.services.spatial_service import haversine_distance, SpatialAnalyticsService

class TestSpatialPostGISEngine(unittest.TestCase):

    def test_haversine_distance_calculation(self):
        # Distance between Delhi (28.6139, 77.2090) and Gurugram (28.4595, 77.0266) is ~30 km
        dist = haversine_distance(28.6139, 77.2090, 28.4595, 77.0266)
        self.assertGreater(dist, 15.0)
        self.assertLess(dist, 50.0)

    def test_dbscan_clustering(self):
        # Test points: 2 points near Jamtara, 2 points near Delhi
        sample_points = [
            {"id": 1, "district": "Jamtara", "state": "Jharkhand", "lat": 23.9632, "lng": 86.8024, "amount": 100000},
            {"id": 2, "district": "Deoghar", "state": "Jharkhand", "lat": 24.4826, "lng": 86.6997, "amount": 200000}, # ~60km from Jamtara
            {"id": 3, "district": "Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090, "amount": 500000},
            {"id": 4, "district": "Gurugram", "state": "Haryana", "lat": 28.4595, "lng": 77.0266, "amount": 300000} # ~30km from Delhi
        ]

        clusters = SpatialAnalyticsService.dbscan_clustering(sample_points, eps_km=75.0, min_samples=1)
        self.assertIsInstance(clusters, dict)
        self.assertGreaterEqual(len(clusters), 2)

    def test_default_spatial_dataset(self):
        dataset = SpatialAnalyticsService._get_default_spatial_dataset()
        self.assertEqual(len(dataset), 8)
        self.assertEqual(dataset[0]["district"], "Jamtara")

if __name__ == "__main__":
    unittest.main()
