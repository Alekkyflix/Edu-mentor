from typing import Dict, Any, Callable, Optional
import yaml
import time

class StrandsClient:
    """
    Mock implementation of AWS Strands SDK for local development.
    """
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.agents: Dict[str, Any] = {}
        self.models: Dict[str, str] = {}
    
    def register_agent(self, name: str, model_id: str, prompt_file: Optional[str] = None, prompt_content: Optional[str] = None, role: str = "general"):
        """
        Registers an agent with a specific model and system prompt.
        Accepts either prompt_file (path) or prompt_content (string).
        """
        try:
            system_prompt = ""
            if prompt_content:
                system_prompt = prompt_content
            elif prompt_file:
                with open(prompt_file, 'r') as f:
                    system_prompt = f.read()
            else:
                 raise ValueError("Either prompt_file or prompt_content must be provided.")
            
            self.agents[name] = {
                "model": model_id,
                "prompt": system_prompt,
                "role": role,
                "history": []
            }
            # Fix slicing error by ensuring it's a string slice (standard python is fine, but for typing)
            context_snippet = system_prompt[:50].replace('\n', ' ')
            print(f"[StrandsSDK] Registered Agent: {name} (Prompt: {context_snippet}...)")
        except Exception as e:
            print(f"[StrandsSDK] Error registering agent {name}: {e}")

    def invoke_agent(self, agent_name: str, input_text: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Simulates invoking an agent. In a real scenario, this calls AWS Bedrock.
        """
        if agent_name not in self.agents:
            return f"Error: Agent {agent_name} not found."
            
        agent = self.agents[agent_name]
        print(f"[{agent_name}] Processing: '{input_text}' (Context: {context})")
        
        # Simulate processing delay
        time.sleep(0.5)
        
        # Mock responses based on agent role
        if agent["role"] == "router":
            # Orchestrator logic
            if "?" in input_text and len(input_text) > 20:
                return "instigator_agent"
            return "sonic_conversationalist"
            
        elif agent["role"] == "conversational":
            return "Sasa! I can help you with that. Let's break it down."
            
        elif agent["role"] == "challenger":
            return "Are you sure about that logic? Walk me through step 2."
            
        return "I'm listening."
