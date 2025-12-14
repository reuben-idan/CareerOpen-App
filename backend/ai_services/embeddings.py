import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        try:
            # Use free sentence transformer model
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            self.is_loaded = True
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            self.is_loaded = False
    
    def encode_text(self, text):
        """Convert text to embedding vector."""
        if not self.is_loaded:
            return None
        
        try:
            return self.model.encode([text])[0]
        except Exception as e:
            logger.error(f"Embedding error: {e}")
            return None
    
    def encode_texts(self, texts):
        """Convert multiple texts to embeddings."""
        if not self.is_loaded:
            return None
        
        try:
            return self.model.encode(texts)
        except Exception as e:
            logger.error(f"Batch embedding error: {e}")
            return None
    
    def calculate_similarity(self, text1, text2):
        """Calculate semantic similarity between two texts."""
        if not self.is_loaded:
            return 0.0
        
        try:
            embeddings = self.encode_texts([text1, text2])
            if embeddings is None:
                return 0.0
            
            similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            return float(similarity)
        except Exception as e:
            logger.error(f"Similarity calculation error: {e}")
            return 0.0
    
    def find_similar_texts(self, query_text, candidate_texts, top_k=5):
        """Find most similar texts to query."""
        if not self.is_loaded or not candidate_texts:
            return []
        
        try:
            query_embedding = self.encode_text(query_text)
            candidate_embeddings = self.encode_texts(candidate_texts)
            
            if query_embedding is None or candidate_embeddings is None:
                return []
            
            similarities = cosine_similarity([query_embedding], candidate_embeddings)[0]
            
            # Get top-k similar texts with scores
            top_indices = np.argsort(similarities)[::-1][:top_k]
            results = []
            
            for idx in top_indices:
                results.append({
                    'text': candidate_texts[idx],
                    'similarity': float(similarities[idx]),
                    'index': int(idx)
                })
            
            return results
        except Exception as e:
            logger.error(f"Similar text search error: {e}")
            return []

# Global instance
embedding_service = EmbeddingService()