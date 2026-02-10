from typing import List, Dict, Any, Optional
import json

class EmbeddingService:
    """
    Interface for Nova Embeddings.
    
    Role: Multimodal Context & Long-term Memory.
    """
    
    def __init__(self):
        # In a real scenario, this would connect to a vector DB (e.g., Pinecone, AWS OpenSearch)
        self.memory_store: Dict[str, Dict[str, Any]] = {}
        
    def generate_embedding(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> List[float]:
        """
        Generates a mock embedding vector.
        """
        # Placeholder: returning a mock vector of dimension 10
        # Real Nova Embeddings specific call would go here
        return [0.1] * 10 

    def generate_image_embedding(self, image_path: str) -> List[float]:
        """
        Mock function to generate an embedding vector from an image.
        """
        print(f"[Embeddings] Processing image at {image_path}...")
        # Placeholder: returning a distinct mock vector for images
        return [0.5] * 10


    def store_memory(self, session_id: str, text: str, metadata: Optional[Dict[str, Any]] = None):
        """
        Stores a memory snippet with its embedding.
        """
        if metadata is None:
            metadata = {}
            
        vector = self.generate_embedding(text)
        key = f"{session_id}_{len(self.memory_store)}"
        self.memory_store[key] = {
            "text": text,
            "vector": vector,
            "metadata": metadata
        }
        print(f"[Embeddings] Stored context for {session_id}: '{text[:30]}...'")

    def retrieve_context(self, session_id: str, query: str, limit: int = 3) -> List[str]:
        """
        Retrieves relevant context based on semantic similarity.
        """
        # Placeholder: just returning the most recent memories for now
        # Real implementation would do cosine similarity search
        print(f"[Embeddings] Retrieving context for query: '{query}'")
        
        # Mock retrieval of last few items
        results = []
        items = list(self.memory_store.items())
        # safe slicing even if list is shorter than limit
        recent_items = items[-limit:] if len(items) > limit else items
        
        for key, data in recent_items:
            results.append(str(data.get("text", "")))
            
        return results
