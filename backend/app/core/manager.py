import os
import yaml
from pathlib import Path
from backend.app.core.models import ModelRegistry, NovaModels
from backend.app.models.state import LearningState
from backend.app.core.state_manager import StateManager
from backend.app.agents.orchestrator import OrchestratorAgent

class EduMentorManager:
    """
    Central Manager for EduMentor AI.
    
    Orchestrates the hierarchical multi-agent system:
    - Initializes AWS Strands SDK client
    - Manages learning state and student context
    - Routes requests between Orchestrator, Sonic, and Instigator agents
    
    This class serves as the main entry point for all student interactions.
    
    Attributes:
        project_root: Path to project root directory
        client: StrandsClient instance for Bedrock communication
        state: LearningState model tracking student progress
        state_manager: StateManager wrapping state logic
        orchestrator_logic: OrchestratorAgent handling routing decisions
    
    Example:
        >>> manager = EduMentorManager("/path/to/project")
        >>> response = manager.process_input("Help me with fractions")
        >>> print(response)
    """
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.client = ModelRegistry.initialize_client(project_root)
        
        # Initialize Core State
        self.state = LearningState(student_id="student_001")
        self.state_manager = StateManager(self.state)
        
        # Initialize Agents & Prompts
        self._initialize_agents()
        
        # Initialize Logic Component
        self.orchestrator_logic = OrchestratorAgent(self.client, self.state_manager)

    def _initialize_agents(self):
        """
        Loads prompts from config and registers agents using centralized Model Registry.
        """
        # Load Prompts & Logic
        # Use relative paths from this file to locate configs reliably in any environment
        # __file__ is .../backend/app/core/manager.py
        # .parent x3 is .../backend
        base_path = Path(__file__).parent.parent.parent
        configs_dir = base_path / "configs"
        
        prompts_path = configs_dir / "orchestrator_prompts.yaml"
        logic_path = configs_dir / "logic.yaml"
        
        try:
            with open(prompts_path, 'r') as f:
                prompts = yaml.safe_load(f)["prompts"]
                
            with open(logic_path, 'r') as f:
                logic = yaml.safe_load(f)["prompt_logic"]
        except FileNotFoundError as e:
            print(f"[Manager] Config file not found at {e.filename}. Using defaults.")
            return

        # 1. Orchestrator (Nova Lite)
        self.client.register_agent(
            name="orchestrator",
            model_id=NovaModels.ORCHESTRATOR.value,
            prompt_content=prompts["orchestrator"]["system"],
            role="router"
        )
        
        # 2. Sonic (Conversationalist)
        # TODO: Dynamically inject logic ("Rule of Three") here
        self.client.register_agent(
            name="sonic",
            model_id=NovaModels.CONVERSATIONALIST.value,
            prompt_content=prompts["sonic"]["persona"],
            role="conversational"
        )
        
        # 3. Instigator (Act)
        self.client.register_agent(
            name="instigator",
            model_id=NovaModels.INSTIGATOR.value,
            prompt_content=prompts["instigator"]["system"],
            role="challenger"
        )

    def process_input(self, user_input: str) -> str:
        """
        Main Event Loop: Input -> Orchestrator Class -> Agent -> Output
        
        Processes student input through the system:
        1. Context is retrieved from State
        2. Input + History is sent to Orchestrator
        3. Orchestrator routes to Lissa (Sonic) or The Sage (Instigator)
        4. Response is added to history and returned
        """
        try:
            # 1. Retrieve history
            history = self.state.session_history
            
            # 2. Process via Orchestrator (Decision + Bedrock Call)
            response = self.orchestrator_logic.process(user_input, history=history)
            
            # 3. Update History
            self.state.session_history.append({"role": "user", "content": user_input})
            self.state.session_history.append({"role": "assistant", "content": response})
            
            # Keep history manageable (last 10 turns)
            if len(self.state.session_history) > 20:
                self.state.session_history = self.state.session_history[-20:]
                
            return response
        except TimeoutError as e:
            print(f"[Manager] Bedrock timeout: {e}")
            return "Pole, I'm thinking a bit slowly. Can you repeat that?"
        except Exception as e:
            print(f"[Manager] Error processing input: {e}")
            raise e
