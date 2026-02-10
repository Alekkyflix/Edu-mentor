from typing import Dict, Any, Optional
import os
import yaml
from pathlib import Path
from backend.app.core.strands_sdk import StrandsClient
from backend.app.models.state import LearningState

class EduMentorManager:
    """
    Central Manager for EduMentor AI.
    Handles AWS Strands SDK initialization, Agent Routing, and State Management.
    """
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.client = StrandsClient(project_root)
        self.state = LearningState(student_id="student_001")
        self._initialize_agents()

    def _initialize_agents(self):
        """
        Loads prompts from config and registers agents.
        """
        config_path = os.path.join(self.project_root, "backend/configs/orchestrator_prompts.yaml")
        with open(config_path, 'r') as f:
            prompts = yaml.safe_load(f)["prompts"]

        # 1. Orchestrator (Nova Lite)
        self.client.register_agent(
            name="orchestrator",
            model_id="amazon.nova-lite-v1:0",
            prompt_content=prompts["orchestrator"]["system"],
            role="router"
        )
        
        # 2. Sonic (Conversationalist)
        self.client.register_agent(
            name="sonic",
            model_id="amazon.nova-sonic-v1:0",
            prompt_content=prompts["sonic"]["persona"],
            role="conversational"
        )
        
        # 3. Instigator (Act)
        self.client.register_agent(
            name="instigator",
            model_id="amazon.nova-act-v1:0",
            prompt_content=prompts["instigator"]["system"],
            role="challenger"
        )

    def process_input(self, user_input: str) -> str:
        """
        Main Event Loop: Input -> Routing -> Agent -> Output -> Telemetry
        """
        # 0. Check Telemetry (Cognitive Friction)
        if self.state.frustration_level > 0.8:
            # Too much struggle -> force hint via Sonic
            return self.client.invoke_agent("sonic", "Student is frustrated. Provide emotional support and a hint.")
            
        # 1. Orchestrate
        # In a real implementation, we would call the orchestrator model to decide.
        # For simulation, we use the logic from the prompt/previous implementation.
        target_agent = "sonic"
        
        if "?" in user_input and len(user_input) > 20:
             target_agent = "instigator"
        elif "check" in user_input.lower():
             target_agent = "instigator"
             
        # 2. Update State (Simplistic)
        if target_agent == "instigator":
            self.state.struggle_score += 1
            
        # 3. Invoke Agent
        response = self.client.invoke_agent(target_agent, user_input, self.state.dict())
        
        return response
