class Retriever:
    def __init__(self, store, embedder):
        self.store = store
        self.embedder = embedder

    def retrieve(self, query: str):
        if not query or not query.strip():
            return []
            
        try:
            qvec = self.embedder.encode([query])[0]
            result = self.store.query(qvec, k=3)

            docs = []
            if result["documents"] and result["documents"][0]:
                for t, m in zip(result["documents"][0], result["metadatas"][0]):
                    docs.append({"text": t, "metadata": m})
            
            return docs
        except Exception as e:
            print(f"❌ Error in retriever: {e}")
            return []