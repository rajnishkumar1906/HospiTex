import os
from pathlib import Path
from typing import List, Any
from langchain_community.document_loaders import PyPDFLoader


class PDFLoader:
    def __init__(self, directory="data/pdf"):
        self.directory = Path(directory)
        os.makedirs(self.directory, exist_ok=True)

    def load(self) -> List[Any]:
        pdfs = list(self.directory.glob("*.pdf"))
        print(f"Found {len(pdfs)} PDF files")

        docs = []
        for pdf in pdfs:
            try:
                print(f"Loading PDF: {pdf.name}")
                loader = PyPDFLoader(str(pdf))
                pages = loader.load()
                for p in pages:
                    p.metadata["source"] = pdf.name
                docs.extend(pages)
                print(f"✅ Successfully loaded {len(pages)} pages from {pdf.name}")
            except Exception as e:
                print(f"❌ Error loading PDF {pdf.name}: {e}")
                continue

        return docs


class TextLoader:
    def __init__(self, directory="data/text_files"):
        self.directory = Path(directory)
        os.makedirs(self.directory, exist_ok=True)

    def load(self) -> List[Any]:
        files = list(self.directory.glob("*.txt"))
        print(f"Found {len(files)} text files")

        docs = []
        for file in files:
            try:
                print(f"Loading text file: {file.name}")
                content = file.read_text(encoding="utf-8")
                
                # Create a document-like object
                from langchain.schema import Document
                doc = Document(
                    page_content=content,
                    metadata={"source": file.name, "file_type": "text"}
                )
                docs.append(doc)
                print(f"✅ Successfully loaded {file.name}")
            except Exception as e:
                print(f"❌ Error loading text file {file.name}: {e}")
                continue

        return docs


class DataLoader:
    def __init__(self, pdf_dir="data/pdf", txt_dir="data/text_files"):
        self.pdf_loader = PDFLoader(pdf_dir)
        self.txt_loader = TextLoader(txt_dir)

    def load_all(self):
        print("\n📥 Loading all documents...")
        
        try:
            pdf_docs = self.pdf_loader.load()
            txt_docs = self.txt_loader.load()
            all_docs = pdf_docs + txt_docs
            print(f"✅ TOTAL documents loaded: {len(all_docs)}")
            
            if len(all_docs) == 0:
                print("⚠️  No documents found. Please add PDF files to 'data/pdf/' or text files to 'data/text_files/'")
            
            return all_docs
            
        except Exception as e:
            print(f"❌ Error in DataLoader: {e}")
            return []