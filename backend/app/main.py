from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
import logging

# ── Ensure project root is on sys.path so `backend.app.*` imports work ────────
# Works whether you run from: project root OR from the backend/ directory.
_here = os.path.dirname(os.path.abspath(__file__))          # .../backend/app
_backend = os.path.dirname(_here)                           # .../backend
_project = os.path.dirname(_backend)                        # project root
for _p in [_project, _backend]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from dotenv import load_dotenv
load_dotenv(os.path.join(_project, '.env'))

# ── Optional observability (fail gracefully if not configured) ────────────────
try:
    import sentry_sdk
    if os.getenv("SENTRY_DSN"):
        sentry_sdk.init(
            dsn=os.getenv("SENTRY_DSN"),
            traces_sample_rate=1.0,
            environment=os.getenv("ENVIRONMENT", "development"),
        )
except ImportError:
    pass

logging.basicConfig(
    level=getattr(logging, os.getenv("LOG_LEVEL", "INFO"), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("edumentor-backend")

try:
    from watchtower import CloudWatchLogHandler
    if os.getenv("AWS_ACCESS_KEY_ID"):
        logger.addHandler(CloudWatchLogHandler(log_group="edumentor-backend"))
        logger.info("CloudWatch logging enabled")
except Exception as e:
    logger.debug(f"CloudWatch logging not enabled: {e}")

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="EduMentor AI Backend",
    version="1.0",
    description="AI tutoring backend powered by Amazon Nova models via AWS Bedrock",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://main.d26ato9lo9grcw.amplifyapp.com",
    "https://*.amplifyapp.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional Prometheus metrics
try:
    from prometheus_fastapi_instrumentator import Instrumentator
    Instrumentator().instrument(app).expose(app)
    logger.info("Prometheus metrics enabled at /metrics")
except ImportError:
    logger.debug("prometheus_fastapi_instrumentator not installed — metrics disabled")

# ── Manager (lazy init to surface errors clearly at startup) ──────────────────
_manager = None

def get_manager():
    global _manager
    if _manager is None:
        from backend.app.core.manager import EduMentorManager
        _manager = EduMentorManager(_project)
        logger.info("EduMentorManager initialised")
    return _manager

# Eagerly initialise at startup so any config errors appear in server logs
@app.on_event("startup")
async def startup_event():
    try:
        get_manager()
        logger.info("✅ EduMentor AI backend ready — Nova models connected")
    except Exception as e:
        logger.error(f"❌ Manager init failed: {e}")
        # Don't crash the server — individual requests will surface the error

# ── Request/Response Models ───────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    student_id: str = "student_default"
    image_base64: str | None = None

class ChatResponse(BaseModel):
    response: str
    telemetry: dict

# ── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
def health_check():
    return {"status": "active", "system": "EduMentor AI", "models": "Amazon Nova (Lite/Pro/Micro)"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint.
    Student message → Manager → Orchestrator → Nova model → Response.
    """
    manager = get_manager()
    try:
        manager.state.student_id = request.student_id
        response_text = manager.process_input(request.message, image_base64=request.image_base64)
        return {
            "response": response_text,
            "telemetry": manager.state.dict(),
        }
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
