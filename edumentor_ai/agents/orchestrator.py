from typing import Dict, Any, Optional
from edumentor_ai.core.strands_sdk import StrandsClient
from edumentor_ai.core.state_manager import StateManager
import yaml

class OrchestratorAgent:
    """
    Refactored Orchestrator using StrandsClient.
    """
    def __init__(self, client: StrandsClient, state_manager: StateManager):
        self.client = client
        self.state = state_manager
        
    def process(self, user_input: str) -> str:
        # 1. Analyze State
        context = self.state.get_context()
        print(f"[Orchestrator] Current State: {context}")
        
        # 2. Invoke Router (Self) via SDK to decide next step
        # In a real app, this would be a specific routing prompt call
        decision = "sonic_conversationalist"
        
        if "?" in user_input and len(user_input) > 20:
             decision = "instigator_agent"
        elif "check" in user_input.lower():
             decision = "instigator_agent"
             
        print(f"[Orchestrator] Routing to: {decision}")
        
        # 3. Invoke Sub-agent
        response = self.client.invoke_agent(decision, user_input, context)
        
        # 4. Post-processing (Update State)
        if decision == "instigator_agent":
            self.state.increment_struggle()
            
        return response
