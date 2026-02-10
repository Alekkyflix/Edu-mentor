from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from .core.manager import EduMentorManager

app = FastAPI(title="EduMentor AI Backend", version="1.0")

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
