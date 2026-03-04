from enum import Enum
from typing import Dict, Any, Optional
from backend.app.core.strands_sdk import StrandsClient

class NovaModels(Enum):
    ORCHESTRATOR     = "us.amazon.nova-lite-v1:0"   # Fast routing decisions
    CONVERSATIONALIST = "us.amazon.nova-pro-v1:0"   # Rich, supportive responses
    INSTIGATOR       = "us.amazon.nova-micro-v1:0"  # Rapid Socratic challenges

class ModelRegistry:
    """
    Central registry for AWS Nova models used in EduMentor AI.
    """
    @staticmethod
    def get_model_id(role: str) -> str:
        if role == "orchestrator":
            return NovaModels.ORCHESTRATOR.value
        elif role == "conversational":
            return NovaModels.CONVERSATIONALIST.value
        elif role == "challenger":
            return NovaModels.INSTIGATOR.value
        else:
            raise ValueError(f"Unknown role: {role}")

    @staticmethod
    def initialize_client(project_root: str) -> StrandsClient:
        """
        Initializes the Strands SDK Client with default settings.
        """
        client = StrandsClient(project_root)
        print(f"[Infrastructure] Initialized StrandsClient at {project_root}")
        return client
