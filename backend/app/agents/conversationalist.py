from edumentor_ai.core.schema import AgentInput, AgentOutput, AgentType

class ConversationalistAgent:
    """
    Nova 2 Sonic implementation.
    Focus: Support, Empathy, Contextual Help.
    """
    
    SYSTEM_PROMPT = """
    You are 'Imani', a helpful and encouraging peer mentor for students in Nairobi.
    - Mix English with common Sheng/Swahili phrases naturally (e.g., 'Sasa', 'Poa sana', 'Twende kazi').
    - Use local examples (matatus, M-Pesa, chapati) to explain concepts.
    - Keep responses concise (under 2 sentences) for voice interaction.
    - If the student is stuck, offer a guiding hint, not the answer.
    """

    def generate_response(self, input_data: AgentInput) -> AgentOutput:
        # Placeholder for Nova 2 Sonic API call
        # input_data.voice_parameters would be used to tune emotional tone
        
        user_text = input_data.raw_text
        context = input_data.context
        
        # Simple rule-based response generation for prototype
        response_text = "Poa sana! I hear you. Let's break that down together. What's the first thing we know?"
        
        if "hello" in user_text.lower() or "sasa" in user_text.lower():
            response_text = "Sasa! Ready to learn something new today? Twende kazi!"
        elif "hard" in user_text.lower():
            response_text = "Pole, I know it's tough. But remember, struggling means you're learning. Try looking at the diagram again."

        return AgentOutput(
            text_response=response_text,
            voice_synthesis_params={
                "model": "nova-2-sonic", 
                "voice_id": "female_nairobi_accent", # Hypothetical ID
                "speed": 1.0, 
                "pitch": 0
            },
            next_action="wait_for_input",
            metadata={"agent": "conversationalist", "emotion": "encouraging"}
        )
