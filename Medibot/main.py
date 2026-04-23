#!/usr/bin/env python3
"""
MediBot - AI Hospital Management Assistant (Stateless Version)
Simple chatbot with no chat history storage
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"], supports_credentials=True)

bot = None

def initialize_rag_system():
    """Initialize the RAG (Retrieval Augmented Generation) system"""
    global bot
    
    try:
        print("🔄 Initializing MediBot RAG System...")
        
        # Import RAG modules using package structure
        from src.loader import DataLoader
        from src.chunker import Chunker
        from src.embedding import EmbeddingModel
        from src.vectorstore import VectorStore
        from src.retriever import Retriever
        from src.llm import ReasoningLLM
        from src.chatbot import MediBot
        
        # Create data directories
        os.makedirs("data/pdf", exist_ok=True)
        os.makedirs("data/text_files", exist_ok=True)
        os.makedirs("data/vector_store", exist_ok=True)
        
        # Load and process documents
        loader = DataLoader()
        docs = loader.load_all()
        
        if not docs:
            print("⚠️  No documents found in data directories")
            return False
            
        chunker = Chunker()
        chunks = chunker.split(docs)
        if not chunks:
            print("⚠️  No chunks created")
            return False
        
        embedder = EmbeddingModel()
        vectors = embedder.encode([c.page_content for c in chunks])
        if vectors.size == 0:
            print("⚠️  No vectors created")
            return False
        
        store = VectorStore()
        store.add(chunks, vectors)
        
        retriever = Retriever(store, embedder)
        llm = ReasoningLLM()
        bot = MediBot(retriever, llm)
        
        print("✅ MediBot RAG System Ready!")
        return True
        
    except Exception as e:
        print(f"❌ RAG initialization failed: {e}")
        return False

try:
    rag_initialized = initialize_rag_system()
    if not rag_initialized or bot is None:
        print("🔄 Using simple bot without RAG...")
        from src.chatbot import SimpleMediBot
        bot = SimpleMediBot()
        print("✅ Simple MediBot ready!")
except Exception as e:
    print(f"❌ Bot initialization failed: {e}")
    bot = None


@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "MediBot API is running", 
        "message": "Simple stateless chatbot - Just ask questions!",
        "version": "2.0.0"
    })

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy" if bot else "degraded",
        "rag_initialized": bot is not None,
        "message": "MediBot is ready to answer your questions"
    })

@app.route("/chat", methods=["POST"])
def chat():
    """Simple chat endpoint - No history storage, just response"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        question = data.get("message", "").strip()
        
        if not question:
            return jsonify({"error": "Please provide a message"}), 400

        if bot is None:
            return jsonify({
                "error": "Chatbot system is not available.",
                "response": "I'm sorry, MediBot is currently unavailable. Please try again later."
            }), 503

        answer = bot.ask(question)

        return jsonify({
            "success": True,
            "question": question,
            "answer": answer,
            "timestamp": datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error in chat endpoint: {e}")
        return jsonify({
            "error": f"Internal server error: {str(e)}",
            "response": "I encountered an error. Please try again."
        }), 500

@app.route("/ask", methods=["POST"])
def ask():
    """Alternative endpoint for backward compatibility"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        question = data.get("question", "").strip()
        
        if not question:
            return jsonify({"error": "Empty question"}), 400

        if bot is None:
            return jsonify({"error": "Chatbot system is not available."}), 503

        answer = bot.ask(question)

        return jsonify({
            "answer": answer,
            "success": True
        })
        
    except Exception as e:
        print(f"❌ Error in ask endpoint: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route("/ping", methods=["GET"])
def ping():
    """Simple ping endpoint for testing"""
    return jsonify({
        "pong": True,
        "timestamp": datetime.utcnow().isoformat()
    })

if __name__ == "__main__":
    print("=" * 60)
    print("🏥 MediBot - AI Hospital Management Assistant (Stateless)")
    print("=" * 60)
    print("📝 Features:")
    print("   - No chat history storage")
    print("   - Simple question-answer format")
    print("   - RAG-powered responses (if documents available)")
    print("   - API-first design")
    print("=" * 60)
    print(f"📍 Server running at: http://127.0.0.1:5001")
    print(f"📊 Health check: http://127.0.0.1:5001/health")
    print(f"💬 Chat endpoint: POST http://127.0.0.1:5001/chat")
    print(f"🏓 Ping: http://127.0.0.1:5001/ping")
    print("=" * 60)
    print("\n💡 Example API call:")
    print("curl -X POST http://localhost:5001/chat \\")
    print("  -H \"Content-Type: application/json\" \\")
    print("  -d '{\"message\":\"How to book an appointment?\"}'")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5001)