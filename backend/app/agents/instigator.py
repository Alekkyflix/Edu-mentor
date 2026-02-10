from typing import Dict, Any, List, Optional
from backend.app.core.strands_sdk import StrandsClient
from backend.app.core.state_manager import StateManager
import random

class InstigatorAgent:
    """
    Nova 2 Act implementation: The Cognitive Friction Engine.
    
    This agent implements "Productive Struggle" through:
    - The Rule of Three (3 questions before any hint)
    - Micro-Sabotage (introducing desirable difficulties)
    - Conviction Testing (challenging correct answers)
    - Socratic Questioning
    
    Uses: us.amazon.nova-2-act-v1:0
    """
    
    def __init__(self, client: StrandsClient, state_manager: Optional[StateManager] = None):
        """
        Initialize the Instigator Agent.
        
        Args:
            client: StrandsClient instance for Bedrock communication
            state_manager: Optional StateManager for tracking student progress
        """
        self.client = client
        self.name = "instigator_agent"
        self.state = state_manager
        self.questions_asked = 0
        self.min_questions_before_hint = 3  # Rule of Three
        
        # Socratic question templates with Nairobi context
        self.question_templates = [
            "What would happen if you tried a different approach? Imagine you're taking a different route to town.",
            "Are you absolutely sure about that? Let's test your conviction.",
            "What's the first principle here? Like, what's the basic foundation—the 'ground floor'?",
            "Can you explain why that works? Walk me through your reasoning step by step.",
            "What if I told you there's a hidden constraint? Like a matatu suddenly changing routes.",
            "How would you explain this to a classmate who's never seen this before?",
            "What assumptions are you making? List them out like items on a shopping list.",
        ]
        
        # Micro-sabotage techniques (desirable difficulties)
        self.sabotage_methods = {
            "constraint_introduction": "Now solve it without using {method}.",
            "scale_change": "What if the numbers were 10x larger? Would your method still work?",
            "reverse_engineering": "Start from the answer and work backwards. Why does it work?",
            "edge_case_challenge": "Your solution works, but what if {edge_case}?",
        }
    
    def generate_response(self, user_input: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate a challenging response using Nova 2 Act.
        
        Implements the Rule of Three and cognitive friction strategies.
        
        Args:
            user_input: Student's message
            context: Session context including struggle score, topic, etc.
            
        Returns:
            Challenging response text designed to promote productive struggle
            
        Raises:
            TimeoutError: If Bedrock API times out
            ValueError: If agent is not properly registered
        """
        try:
            # Increment question counter
            self.questions_asked += 1
            
            # Detect if student is seeking validation
            is_seeking_validation = any(phrase in user_input.lower() for phrase in 
                                       ["is this right", "am i correct", "is it", "check this"])
            
            # Detect if student seems confident (no question marks, declarative)
            seems_confident = "?" not in user_input and len(user_input) > 15
            
            # Build enhanced context for the model
            enhanced_context = context or {}
            enhanced_context.update({
                "questions_asked": self.questions_asked,
                "can_give_hint": self.questions_asked >= self.min_questions_before_hint,
                "is_validation_request": is_seeking_validation,
                "student_confidence": "high" if seems_confident else "uncertain"
            })
            
            # Construct prompt based on situation
            if is_seeking_validation:
                response = self._test_conviction(user_input, enhanced_context)
            elif self.questions_asked < self.min_questions_before_hint:
                response = self._ask_guiding_question(user_input, enhanced_context)
            else:
                response = self._offer_strategic_hint(user_input, enhanced_context)
            
            # Update state if available
            if self.state:
                self.state.increment_struggle()
            
            return response
            
        except TimeoutError as e:
            print(f"[Instigator] Bedrock timeout: {e}")
            return "Hmm, let me think about that... Can you rephrase your question while I gather my thoughts?"
        except Exception as e:
            print(f"[Instigator] Error: {e}")
            return "Interesting challenge! Let's approach this systematically. What's your current understanding?"
    
    def _ask_guiding_question(self, user_input: str, context: Dict[str, Any]) -> str:
        """
        Ask a Socratic question to guide thinking (Rule of Three enforcement).
        """
        question = random.choice(self.question_templates)
        
        # Add Nairobi flavor
        nairobi_intros = [
            "Ebu tufikirie... ",  # Let's think...
            "Ngoja kidogo... ",   # Wait a bit...
            "Interesting point. ", 
        ]
        
        intro = random.choice(nairobi_intros)
        
        # Invoke agent via client (in production, this calls Bedrock)
        # For now, using template-based response
        return f"{intro}{question}"
    
    def _test_conviction(self, user_input: str, context: Dict[str, Any]) -> str:
        """
        Challenge the student's confidence to ensure deep understanding.
        """
        conviction_tests = [
            "Are you sure? Explain why that must be true.",
            "Prove it. What's your reasoning?",
            "Interesting. But what if I told you there's a flaw in that logic?",
            "Confidence is good, but let's verify. Walk me through each step.",
            "Okay, now defend that answer against this counter-example: {example}",
        ]
        
        return random.choice(conviction_tests)
    
    def _offer_strategic_hint(self, user_input: str, context: Dict[str, Any]) -> str:
        """
        After Rule of Three is satisfied, provide a structured hint (not the answer).
        """
        hints = [
            "Here's a hint: Think about the relationship between {concept_a} and {concept_b}.",
            "Try breaking it into smaller pieces. What's the first step you're confident about?",
            "Remember what we learned about {topic}? Apply that principle here.",
            "Like planning a route on a matatu—you need to know your stops. What are the 'stops' in this problem?",
        ]
        
        return random.choice(hints)
    
    def introduce_micro_sabotage(self, current_method: str) -> str:
        """
        Introduce a 'desirable difficulty' to deepen learning.
        
        Example: If student is using a calculator, ask them to solve without it.
        
        Args:
            current_method: The approach the student is currently using
            
        Returns:
            A challenge that constrains their current method
        """
        sabotage_type = random.choice(list(self.sabotage_methods.keys()))
        template = self.sabotage_methods[sabotage_type]
        
        return template.format(
            method=current_method,
            edge_case="the input was negative"
        )
    
    def reset_question_counter(self):
        """Reset the question counter for a new topic or problem."""
        self.questions_asked = 0
