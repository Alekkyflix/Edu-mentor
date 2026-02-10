from typing import Dict, Any, List
from backend.app.models.state import LearningState

class StateManager:
    """
    Manages the 'Learning State' logic, wrapping the Pydantic data model.
    """
    def __init__(self, state: LearningState):
        self._state = state
        
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
            "struggle": self._state.struggle_score,
            "history_len": len(self._state.session_history)
        }
