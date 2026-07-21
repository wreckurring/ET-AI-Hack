import os
import uuid
import logging
from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import auth, reports, analytics, graph, fast_freeze, seed, ai_scam, health, copilot, websockets

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("raksha.main")

# Initialize database tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
except Exception as e:
    logger.warning(f"Database initialization deferred: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    description="RAKSHA-NET AI Cyber Fraud Intelligence Platform API (India)"
)

# 1. Response Compression Middleware (Min size 1KB)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 2. CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Production default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Security Headers & Request Tracing Middleware
@app.middleware("http")
async def security_and_tracing_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    response: Response = await call_next(request)
    
    # Trace Request ID
    response.headers["X-Request-ID"] = request_id
    
    # Production Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# 4. Global Exception Handling Middleware
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred. Please contact system administrator.",
            "error_type": exc.__class__.__name__
        }
    )

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Root Health Check Redirect
@app.get("/health", include_in_schema=False)
def root_health_check(request: Request):
    return health.system_health_check()

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(graph.router, prefix=settings.API_V1_STR)
app.include_router(fast_freeze.router, prefix=settings.API_V1_STR)
app.include_router(ai_scam.router, prefix=settings.API_V1_STR)
app.include_router(copilot.router, prefix=settings.API_V1_STR)
app.include_router(websockets.router)
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(seed.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    logger.info(f"Starting {settings.PROJECT_NAME} backend in production mode.")
