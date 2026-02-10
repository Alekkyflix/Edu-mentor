from backend.app.core.strands_sdk import StrandsClient

class SonicAgent:
    """
    Wrapper for Nova 2 Sonic agent.
    """
    def __init__(self, client: StrandsClient):
        self.client = client
        self.name = "sonic_conversationalist"

    # In Strands SDK, the client handles the invocation, 
    # but this class can hold specific logic if needed.
