import sys
import os

# Add project root to sys.path to allow imports from edumentor_ai package
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

import yaml
from edumentor_ai.core.strands_sdk import StrandsClient
from edumentor_ai.core.state_manager import StateManager
from edumentor_ai.agents.orchestrator import OrchestratorAgent

def load_config(path: str):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def main():
    print("Initializing EduMentor AI (AWS Strands Architecture)...")
    
    # 1. Initialize SDK
    project_root = os.path.dirname(os.path.abspath(__file__))
    client = StrandsClient(project_root)
    state_manager = StateManager()
    
    # 2. Load Configs
    agents_def = load_config(os.path.join(project_root, "agents/definitions.yaml"))
    nairobi_env = load_config(os.path.join(project_root, "configs/nairobi_env.yaml"))
    
    # Format the localization context string
    vocab = nairobi_env.get("vocabulary", {})
    context_markers = nairobi_env.get("context_markers", {})
    
    localization_str = "VOCABULARY:\n"
    for category, terms in vocab.items():
        if isinstance(terms, list):
            localization_str += f"- {category.title()}: {', '.join(terms)}\n"
        elif isinstance(terms, dict):
             localization_str += f"- {category.title()}: {', '.join([f'{k} ({v})' for k,v in terms.items()])}\n"
             
    localization_str += "\nCONTEXT MARKERS:\n"
    for marker, description in context_markers.items():
        localization_str += f"- {marker}: {description}\n"

    # 3. Register Agents
    for agent in agents_def["agents"]:
        # Map prompt files based on agent roles/names
        prompt_name = "orchestrator.txt"
        if agent["type"] == "conversational":
            prompt_name = "sonic_persona.txt"
        elif agent["type"] == "challenger":
            prompt_name = "instigator_struggle.txt"
            
        auth_prompt = os.path.join(project_root, "prompts", prompt_name)
        
        # Read and format prompt
        with open(auth_prompt, 'r') as f:
            template = f.read()
            
        # Inject config if placeholder exists, otherwise append if relevant
        final_prompt = template
        if "{localization_context}" in template:
            final_prompt = template.format(localization_context=localization_str)
            
        # We need to manually register with the formatted string, but StrandsClient currently takes a file.
        # Let's modify StrandsClient.register_agent logic effectively by bypassing the file read in main 
        # OR we update StrandsClient to accept a string?
        # The instruction was to "Initializes the StrandsClient... Registers the Nova 2 models". 
        # The StrandsClient.register_agent implementation reads from file. 
        # Let's override it by passing a temporary file or assume we update StrandsClient to take content?
        # Actually, let's just update StrandsClient to support passing raw prompt content as an overload 
        # or we hack it here by writing to a temp file? 
        # Better: Let's refactor StrandsClient in the next step to accept `prompt_content` optional.
        # For now, I will modify this loop to assume I will update `register_agent` signature in `strands_sdk.py`.
        
        client.register_agent(
            name=agent["name"], 
            model_id=agent["model"],
            prompt_content=final_prompt, # NEW ARGUMENT
            role=agent["type"]
        )

    # 4. Initialize Orchestrator
    orchestrator = OrchestratorAgent(client, state_manager)
    
    print("System Ready. (Type 'quit' to exit)")
    
    while True:
        try:
            user_input = input("Student: ")
            if user_input.lower() in ['quit', 'exit']:
                break
                
            response = orchestrator.process(user_input)
            print(f"> {response}")
                
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    main()
