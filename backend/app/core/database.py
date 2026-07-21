from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import logging
from app.core.config import settings

logger = logging.getLogger("raksha.db")

# Fallback memory SQLite engine if postgresql fails to connect in dev
try:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        pass
    logger.info("Successfully connected to PostgreSQL database.")
except Exception as e:
    logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to local SQLite database for development.")
    os.makedirs("data", exist_ok=True)
    engine = create_engine("sqlite:///./data/raksha_net.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
