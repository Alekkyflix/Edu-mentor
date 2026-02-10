from dataclasses import dataclass, field
from typing import Dict, Any, List

@dataclass
class LearningState:
    student_id: str
    current_topic: str = "Unset"
    frustration_level: float = 0.0 # 0.0 to 1.0
    struggle_score: int = 0
    session_history: List[str] = field(default_factory=list)

class StateManager:
    """
    Manages the 'Learning State' schema.
    """
    def __init__(self):
        self._state = LearningState(student_id="student_001")
        
    def update_frustration(self, delta: float):
        self._state.frustration_level = max(0.0, min(1.0, self._state.frustration_level + delta))
        print(f"[State] Frustration Level: {self._state.frustration_level:.2f}")

    def increment_struggle(self):
        self._state.struggle_score += 1
        print(f"[State] Struggle Score: {self._state.struggle_score}")

    def get_context(self) -> Dict[str, Any]:
        return {
            "topic": self._state.current_topic,
            "frustration": self._state.frustration_level,
            "struggle": self._state.struggle_score
        }
