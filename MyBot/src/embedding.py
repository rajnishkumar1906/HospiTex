import numpy as np
from sentence_transformers import SentenceTransformer

class EmbeddingModel:
    def __init__(self, name="all-MiniLM-L6-v2"):
        print(f"🔄 Loading embedding model: {name}")
        try:
            self.model = SentenceTransformer(name)
        except Exception as e:
            print(f"❌ Error loading embedding model: {e}")
            raise

    def encode(self, texts):
        if not texts:
            print("⚠️  No texts to embed")
            return np.array([])
            
        print(f"Embedding {len(texts)} texts...")
        try:
            return np.array(self.model.encode(texts, show_progress_bar=True))
        except Exception as e:
            print(f"❌ Error embedding texts: {e}")
            return np.array([])