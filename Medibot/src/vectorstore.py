import uuid
import chromadb
import os

class VectorStore:
    def __init__(self, path="data/vector_store", name="medibot_docs"):
        os.makedirs(path, exist_ok=True)
        try:
            self.client = chromadb.PersistentClient(path=path)
            self.collection = self.client.get_or_create_collection(name)
            print(f"📦 Vector store ready. Existing docs: {self.collection.count()}")
        except Exception as e:
            print(f"❌ Error initializing vector store: {e}")
            raise

    def add(self, chunks, embeddings):
        if not chunks or len(chunks) == 0:
            print("⚠️  No chunks to add to vector store")
            return
            
        try:
            ids = [uuid.uuid4().hex for _ in chunks]
            docs = [c.page_content for c in chunks]
            metas = [c.metadata for c in chunks]

            self.collection.add(
                ids=ids,
                documents=docs,
                embeddings=embeddings.tolist(),
                metadatas=metas
            )
            print(f"✅ Added {len(chunks)} vectors → Total: {self.collection.count()}")
        except Exception as e:
            print(f"❌ Error adding to vector store: {e}")

    def query(self, vector, k=3):
        if self.collection.count() == 0:
            return {"documents": [[]], "metadatas": [[]]}
            
        try:
            return self.collection.query(
                query_embeddings=[vector.tolist()],
                n_results=min(k, self.collection.count())
            )
        except Exception as e:
            print(f"❌ Error querying vector store: {e}")
            return {"documents": [[]], "metadatas": [[]]}