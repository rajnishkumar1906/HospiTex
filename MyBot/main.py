#!/usr/bin/env python3
"""
MediBot - AI Hospital Management Assistant
Main entry point for the Flask application
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to Python path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

# ============================================================
# 🔥 FLASK APP CONFIGURATION
# ============================================================
app = Flask(__name__)

# Enable CORS for HospiTex-UI
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"], supports_credentials=True)

# Database configuration
DB_FOLDER = os.path.join(os.getcwd(), "database")
os.makedirs(DB_FOLDER, exist_ok=True)
DB_FILE = os.path.join(DB_FOLDER, "medibot.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_FILE}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# ============================================================
# 📌 DATABASE MODELS
# ============================================================
class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), default="New Chat")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)
    messages = db.relationship('Message', backref='chat', lazy=True, cascade='all, delete-orphan')

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    role = db.Column(db.String(20))   # user / assistant
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================================
# 🗄 INITIALIZE DATABASE
# ============================================================
def init_db():
    """Initialize database with proper table creation"""
    with app.app_context():
        try:
            # Check if tables exist
            db.create_all()
            
            # Migrate existing data: set last_accessed to created_at for existing chats
            chats = Chat.query.all()
            for chat in chats:
                if not chat.last_accessed:
                    chat.last_accessed = chat.created_at
            db.session.commit()
            
            print("✅ Database initialized with updated schema")
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            # If there's an error, drop and recreate
            db.drop_all()
            db.create_all()
            print("✅ Database recreated with clean schema")

# Initialize database
init_db()

# ============================================================
# 🧠 RAG SYSTEM INITIALIZATION
# ============================================================
def initialize_rag_system():
    """
    Initialize the RAG (Retrieval Augmented Generation) system
    """
    try:
        print("🚀 Initializing MediBot RAG System...")
        
        # Import RAG modules
        from loader import DataLoader
        from chunker import Chunker
        from embedding import EmbeddingModel
        from vectorstore import VectorStore
        from retriever import Retriever
        from llm import ReasoningLLM
        from chatbot import MediBot
        
        # Create data directories
        os.makedirs("data/pdf", exist_ok=True)
        os.makedirs("data/text_files", exist_ok=True)
        os.makedirs("data/vector_store", exist_ok=True)
        
        # Load and process documents
        docs = DataLoader().load_all()
        if not docs:
            print("No documents found in data directories")
            return None
            
        chunker = Chunker()
        chunks = chunker.split(docs)
        if not chunks:
            return None
        
        embedder = EmbeddingModel()
        vectors = embedder.encode([c.page_content for c in chunks])
        if vectors.size == 0:
            return None
        
        store = VectorStore()
        store.add(chunks, vectors)
        
        retriever = Retriever(store, embedder)
        llm = ReasoningLLM()
        bot = MediBot(retriever, llm)
        
        print("✅ MediBot RAG System Ready!")
        return bot
        
    except Exception as e:
        print(f"❌ RAG initialization failed: {e}")
        return None

# Initialize the bot system
try:
    bot = initialize_rag_system()
except Exception as e:
    bot = None

# Fallback to simple bot if RAG initialization fails
if bot is None:
    print("🔄 Using simple bot without RAG...")
    try:
        from chatbot import SimpleMediBot
        bot = SimpleMediBot()
    except Exception as e:
        bot = None

# ============================================================
# 🌍 FLASK ROUTES
# ============================================================

@app.route("/")
def home():
    """Health check endpoint"""
    return jsonify({"status": "MediBot API is running", "message": "Use HospiTex-UI for the interface"})

@app.route("/chat/new", methods=["GET"])
def new_chat():
    """Create a new chat session"""
    try:
        chat = Chat()
        db.session.add(chat)
        db.session.commit()
        return jsonify({
            "chat_id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at.isoformat(),
            "last_accessed": chat.last_accessed.isoformat()
        })
    except Exception as e:
        return jsonify({"error": f"Failed to create chat: {str(e)}"}), 500

@app.route("/chat/list", methods=["GET"])
def list_chats():
    """Get list of all chat sessions"""
    try:
        chats = Chat.query.order_by(Chat.last_accessed.desc()).all()
        chat_list = []
        for chat in chats:
            first_message = Message.query.filter_by(chat_id=chat.id).order_by(Message.timestamp.asc()).first()
            title = chat.title
            if first_message and first_message.role == 'user':
                title = first_message.content[:40] + ("..." if len(first_message.content) > 40 else "")
            
            # Use the most recent message timestamp for display
            last_message = Message.query.filter_by(chat_id=chat.id).order_by(Message.timestamp.desc()).first()
            display_time = chat.last_accessed if chat.last_accessed else (last_message.timestamp if last_message else chat.created_at)
            
            chat_list.append({
                "id": chat.id,
                "title": title or "New Chat",
                "created_at": chat.created_at.isoformat(),
                "last_accessed": chat.last_accessed.isoformat(),
                "display_time": display_time.isoformat(),  # For frontend display
                "message_count": Message.query.filter_by(chat_id=chat.id).count()
            })
        
        return jsonify(chat_list)
    except Exception as e:
        return jsonify({"error": f"Failed to load chats: {str(e)}"}), 500

@app.route("/chat/<int:chat_id>", methods=["GET"])
def load_chat(chat_id):
    """Load messages from a specific chat"""
    try:
        chat = Chat.query.get(chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        msgs = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp.asc()).all()
        return jsonify({
            "chat_id": chat_id,
            "title": chat.title,
            "messages": [
                {
                    "id": m.id,
                    "role": m.role, 
                    "content": m.content, 
                    "timestamp": m.timestamp.isoformat()
                }
                for m in msgs
            ]
        })
    except Exception as e:
        return jsonify({"error": f"Failed to load chat: {str(e)}"}), 500

@app.route("/chat/activate/<int:chat_id>", methods=["POST"])
def activate_chat(chat_id):
    """
    Unique API endpoint to activate/open a specific chat
    Updates last_accessed timestamp and returns chat data
    """
    try:
        chat = Chat.query.get(chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
        
        # Update last accessed timestamp
        chat.last_accessed = datetime.utcnow()
        db.session.commit()
        
        # Get chat messages
        msgs = Message.query.filter_by(chat_id=chat_id).order_by(Message.timestamp.asc()).all()
        
        return jsonify({
            "success": True,
            "chat_id": chat_id,
            "title": chat.title,
            "last_accessed": chat.last_accessed.isoformat(),
            "messages": [
                {
                    "id": m.id,
                    "role": m.role, 
                    "content": m.content, 
                    "timestamp": m.timestamp.isoformat()
                }
                for m in msgs
            ]
        })
    except Exception as e:
        return jsonify({"error": f"Failed to activate chat: {str(e)}"}), 500

@app.route("/chat/delete/<int:chat_id>", methods=["DELETE"])
def delete_chat(chat_id):
    """Delete a chat and all its messages"""
    try:
        chat = Chat.query.get(chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404
            
        Message.query.filter_by(chat_id=chat_id).delete()
        db.session.delete(chat)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": f"Chat {chat_id} deleted successfully"
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete chat: {str(e)}"}), 500

@app.route("/ask", methods=["POST"])
def ask():
    """Ask MediBot a question"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        question = data.get("question", "").strip()
        chat_id = data.get("chat_id")

        if not question:
            return jsonify({"error": "Empty question"}), 400

        if not bot:
            return jsonify({"error": "Chatbot system is not available."}), 503

        # Create chat if missing
        if not chat_id:
            chat = Chat()
            db.session.add(chat)
            db.session.commit()
            chat_id = chat.id
        else:
            chat = Chat.query.get(chat_id)
            if not chat:
                chat = Chat()
                db.session.add(chat)
                db.session.commit()
                chat_id = chat.id

        # Save user message
        user_msg = Message(chat_id=chat_id, role="user", content=question)
        db.session.add(user_msg)
        db.session.commit()

        # Generate response
        answer = bot.ask(question)

        # Save assistant message
        bot_msg = Message(chat_id=chat_id, role="assistant", content=answer)
        db.session.add(bot_msg)

        # Update chat title and last accessed
        chat = Chat.query.get(chat_id)
        if chat and (chat.title == "New Chat" or not chat.title):
            chat.title = question[:40] + ("..." if len(question) > 40 else "")
        chat.last_accessed = datetime.utcnow()

        db.session.commit()

        return jsonify({
            "answer": answer, 
            "chat_id": chat_id
        })
        
    except Exception as e:
        print(f"Error in ask endpoint: {e}")
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    try:
        chat_count = Chat.query.count()
        message_count = Message.query.count()
        
        status = {
            "status": "healthy" if bot else "degraded",
            "rag_initialized": bot is not None,
            "database": "connected",
            "chats_count": chat_count,
            "messages_count": message_count
        }
        return jsonify(status)
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500

# ============================================================
# 🚀 APPLICATION STARTUP
# ============================================================
if __name__ == "__main__":
    print("🏥 MediBot - AI Hospital Management Assistant")
    print("🔥 Server running at http://127.0.0.1:5001")
    app.run(debug=True, host='0.0.0.0', port=5001)