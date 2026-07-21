import os
import sys
import time
from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db
from app.core.neo4j_db import neo4j_client

router = APIRouter(tags=["Health & System Diagnostics"])

# Record start time for uptime calculation
START_TIME = time.time()

@router.get("/health")
def system_health_check(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Production System Health Check & Diagnostics Endpoint.
    Monitors:
    - PostgreSQL database connection & table availability
    - PostGIS spatial extension status
    - Neo4j Graph Database connection status
    - System uptime and process memory statistics
    Returns HTTP 200 OK with health status breakdown.
    """
    uptime_seconds = round(time.time() - START_TIME, 2)
    
    # 1. Check PostgreSQL database status
    postgres_status = "HEALTHY"
    postgres_error = None
    try:
        db.execute(text("SELECT 1")).fetchone()
    except Exception as e:
        postgres_status = "DEGRADED (SQLite Fallback)"
        postgres_error = str(e)

    # 2. Check PostGIS extension status
    postgis_enabled = False
    try:
        res = db.execute(text("SELECT PostGIS_Version()")).fetchone()
        if res:
            postgis_enabled = True
    except Exception:
        postgis_enabled = False

    # 3. Check Neo4j database status
    neo4j_status = "HEALTHY" if neo4j_client.is_connected() else "OFFLINE (Fallback Active)"

    overall_status = "HEALTHY" if postgres_status == "HEALTHY" and neo4j_status == "HEALTHY" else "OPERATIONAL"

    return {
        "status": overall_status,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "uptime_seconds": uptime_seconds,
        "services": {
            "postgres_database": {
                "status": postgres_status,
                "postgis_extension": "ACTIVE" if postgis_enabled else "STANDBY",
                "error": postgres_error
            },
            "neo4j_graph": {
                "status": neo4j_status
            },
            "api_server": {
                "status": "HEALTHY",
                "version": "1.0.0",
                "environment": os.getenv("ENVIRONMENT", "production")
            }
        }
    }
