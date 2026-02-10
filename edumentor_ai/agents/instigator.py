from edumentor_ai.core.strands_sdk import StrandsClient

class InstigatorAgent:
    """
    Wrapper for Nova 2 Act agent.
    """
    def __init__(self, client: StrandsClient):
        self.client = client
        self.name = "instigator_agent"
