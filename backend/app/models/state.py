from pydantic import BaseModel, Field
from typing import List, Optional

class LearningState(BaseModel):
    student_id: str
    current_topic: str = "Unset"
    frustration_level: float = Field(0.0, ge=0.0, le=1.0, description="0.0 to 1.0")
    struggle_score: int = Field(0, description="Count of incorrect attempts or challenges")
    struggle_duration: int = Field(0, description="Seconds spent on current problem")
    conceptual_mastery: float = Field(0.0, ge=0.0, le=1.0)
    session_history: List[str] = []
