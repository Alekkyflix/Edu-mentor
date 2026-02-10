from typing import Dict, Any, Optional
from backend.app.core.strands_sdk import StrandsClient
from backend.app.core.state_manager import StateManager
import yaml

class OrchestratorAgent:
    """
    Hierarchical Routing Agent using Nova Lite.
    
    The Orchestrator is the brain of EduMentor AI's multi-agent system.
    It analyzes student state (struggle score, frustration level) and routes
    requests to either:
    - Sonic (Conversationalist): When student needs support
    - Instigator (Act): When student needs cognitive challenge  
    
    Uses: us.amazon.nova-lite-v1:0 for fast, cost-effective routing decisions.
    
    Attributes:
        client: StrandsClient for Bedrock communication
        state: StateManager tracking student progress
    
    Routing Logic:
        High frustration (>0.7) → Sonic (support)
        Low struggle (<3) + confident → Instigator (challenge)
        Validation requests → Instigator (test conviction)
    """
    def __init__(self, client: StrandsClient, state_manager: StateManager):
        self.client = client
        self.state = state_manager
        
    def process(self, user_input: str) -> str:
        """
        Process student input and route to appropriate agent.
        
        This is the core decision-making function implementing "Productive Struggle":
        1. Analyzes current student state (frustration, struggle score)
        2. Applies routing heuristics to select agent
        3. Invokes chosen agent via Bedrock
        4. Updates state based on interaction
        
        Args:
            user_input: Student's message
            
        Returns:
            Response from Sonic or Instigator agent
            
        Raises:
            TimeoutError: If Bedrock API times out
            ValueError: If routing logic fails
        """
        try:
            # 1. Analyze State
            context = self.state.get_context()
            print(f"[Orchestrator] Current State: {context}")
            
            # 2. Logic: "The Productive Struggle"
            # If Struggle Score is too low (student is breezing through), trigger Instigator to add friction.
            # If Struggle Score is too high (frustration), trigger Sonic for support.
            
            struggle_score = context.get("struggle", 0)
            frustration = context.get("frustration", 0.0)
            
            decision = "sonic" # Default to Conversationalist
            
            if frustration > 0.7:
                 # High frustration -> Support needed
                 decision = "sonic"
                 print("[Orchestrator] High frustration detected. Routing to Sonic for support.")
                 
            elif struggle_score < 3 and len(user_input) > 10 and "?" not in user_input:
                 # Low struggle + confident statement -> Challenge them!
                 decision = "instigator"
                 print("[Orchestrator] Low struggle detected. Routing to Instigator for cognitive friction.")
                 
            elif "check" in user_input.lower() or "right?" in user_input.lower():
                 # Explicit request for validation -> Opportunity for Socratic questioning
                 decision = "instigator"
                 
            # 3. Invoke Sub-agent
            # Note: self.client.invoke_agent logic would handle the actual Bedrock call
            response = self.client.invoke_agent(decision, user_input, context)
            
            # 4. Post-processing (Update State)
            if decision == "instigator":
                self.state.increment_struggle()
                
            return response
            
        except TimeoutError as e:
            print(f"[Orchestrator] Bedrock timeout: {e}")
            # Fallback response
            return "Ngoja kidogo... Let me think about that. Can you rephrase?"
        except Exception as e:
            print(f"[Orchestrator] Error in routing: {e}")
            # Safe fallback
            return "Sasa! I'm here to help. What do you need?"
