from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import sys
import logging
import sentry_sdk
from prometheus_fastapi_instrumentator import Instrumentator
from watchtower import CloudWatchLogHandler

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from .core.manager import EduMentorManager

# --- Observability Setup ---
# 1. Sentry
if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
        environment=os.getenv("ENVIRONMENT", "development")
    )

# 2. Logging (CloudWatch)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("edumentor-backend")
if os.getenv("AWS_ACCESS_KEY_ID"): # Only enable CloudWatch if creds exist
    try:
        logger.addHandler(CloudWatchLogHandler(log_group="edumentor-backend"))
        logger.info("CloudWatch logging enabled")
    except Exception as e:
        logger.warning(f"Failed to enable CloudWatch logging: {e}")

app = FastAPI(title="EduMentor AI Backend", version="1.0")

# 3. Prometheus Metrics
Instrumentator().instrument(app).expose(app)

# Initialize Manager
# In a real app, use dependency injection or a lifespan context
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
manager = EduMentorManager(project_root)

class ChatRequest(BaseModel):
    message: str
    student_id: str

class ChatResponse(BaseModel):
    response: str
    telemetry: dict

@app.get("/")
def health_check():
    return {"status": "active", "system": "EduMentor AI"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Main interaction endpoint.
    Recieves student message -> Manager -> Agent -> Response.
    """
    try:
        # Update state with student ID (simplification)
        manager.state.student_id = request.student_id
        
        # Process via Manager
        response_text = manager.process_input(request.message)
        
        return {
            "response": response_text,
            "telemetry": manager.state.dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
