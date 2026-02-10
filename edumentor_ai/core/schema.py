from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum

class AgentType(Enum):
    ORCHESTRATOR = "orchestrator"
    CONVERSATIONALIST = "conversationalist" # Nova 2 Sonic
    INSTIGATOR = "instigator" # Nova 2 Act

@dataclass
class StudentContext:
    student_id: str
    session_id: str
    current_topic: Optional[str] = None
    struggle_level: float = 0.0 # 0.0 to 1.0 (1.0 = highly frustrated/blocked)
    history: List[Dict[str, Any]] = field(default_factory=list)

@dataclass
class AgentInput:
    raw_text: str
    image_path: Optional[str] = None
    voice_parameters: Optional[Dict[str, Any]] = None # Pitch, speed, etc.
    context: StudentContext = field(default_factory=lambda: StudentContext("default", "session_1"))

@dataclass
class AgentOutput:
    text_response: str
    voice_synthesis_params: Dict[str, Any] # For Nova 2 Sonic
    next_action: str # "wait_for_input", "end_session", "handover"
    metadata: Dict[str, Any] = field(default_factory=dict)
