from langchain.text_splitter import RecursiveCharacterTextSplitter

class Chunker:
    def __init__(self, size=300, overlap=100):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=size,
            chunk_overlap=overlap,
            length_function=len
        )

    def split(self, docs):
        if not docs:
            print("⚠️  No documents to chunk")
            return []
            
        try:
            chunks = self.splitter.split_documents(docs)
            print(f"📄 Created {len(chunks)} chunks")
            return chunks
        except Exception as e:
            print(f"❌ Error chunking documents: {e}")
            return []