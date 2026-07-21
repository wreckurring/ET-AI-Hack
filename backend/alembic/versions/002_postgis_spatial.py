"""PostGIS Spatial Engine migration

Revision ID: 002_postgis_spatial
Revises: 001_initial_schema
Create Date: 2026-07-21 22:51:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '002_postgis_spatial'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. Enable PostGIS Extension if supported by PostgreSQL server
    try:
        op.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        op.execute("ALTER TABLE fraud_reports ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);")
        op.execute("CREATE INDEX IF NOT EXISTS idx_fraud_reports_geom ON fraud_reports USING GIST (geom);")
        op.execute("UPDATE fraud_reports SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) WHERE longitude IS NOT NOT NULL;")
    except Exception:
        pass # Fallback when running standard SQL / SQLite

    # Add geom_wkt column
    try:
        op.add_column('fraud_reports', sa.Column('geom_wkt', sa.Text(), nullable=True))
    except Exception:
        pass

def downgrade() -> None:
    try:
        op.drop_column('fraud_reports', 'geom_wkt')
    except Exception:
        pass
