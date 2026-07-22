from neo4j import GraphDatabase
import logging
from app.core.config import settings

logger = logging.getLogger("under_tow.neo4j")

class Neo4jManager:
    def __init__(self):
        self.driver = None
        self._connected = False
        try:
            self.driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            # Test connectivity
            self.driver.verify_connectivity()
            self._connected = True
            logger.info("Successfully connected to Neo4j database.")
        except Exception as e:
            logger.warning(f"Neo4j instance not reachable ({e}). Standalone/fallback graph engine activated.")

    def is_connected(self):
        return self._connected

    def close(self):
        if self.driver:
            self.driver.close()

    def run_query(self, query: str, parameters: dict = None):
        if not self._connected or not self.driver:
            return None
        with self.driver.session() as session:
            result = session.run(query, parameters or {})
            return [record.data() for record in result]

neo4j_client = Neo4jManager()
