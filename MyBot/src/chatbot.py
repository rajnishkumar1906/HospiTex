from src.llm import ReasoningLLM
from typing import List

class MediBot:
    def __init__(self, retriever=None, llm=None):
        self.retriever = retriever
        self.llm = llm or ReasoningLLM()
        print("🤖 MediBot ready!\n")

    def get_context(self, query: str) -> str:
        """
        Get relevant context from retriever
        """
        if not self.retriever:
            return ""
        
        try:
            docs = self.retriever.retrieve(query)
            if not docs:
                return "NO CONTEXT FOUND"
            return "\n\n".join(d["text"] for d in docs)
        except Exception as e:
            print(f"Retriever error: {e}")
            return "NO CONTEXT FOUND"

    def ask(self, query: str) -> str:
        """
        Get concise response from the bot
        """
        if not query or not query.strip():
            return "Please ask a question about hospital services, appointments, or medical assistance."
        
        query = query.strip()
        
        # Get relevant context
        context = self.get_context(query)
        
        try:
            # Use LLM to generate concise response
            response = self.llm.ask(query, context)
            return response
        except Exception as e:
            print(f"LLM ERROR: {e}")
            return "Unable to answer right now. Please try again."

    def chat(self):
        """
        Interactive chat mode in terminal
        """
        print("🏥 MediBot - Hospital Management Assistant")
        print("Type 'exit' or 'quit' to end the conversation.\n")
        
        while True:
            try:
                user_input = input("You: ").strip()
                
                if user_input.lower() in ("exit", "quit", "bye"):
                    print("👋 Thank you for using MediBot! Goodbye!")
                    break
                
                if not user_input:
                    print("MediBot: Please type your question about hospital services.")
                    continue
                
                print("MediBot: Thinking...")
                response = self.ask(user_input)
                print(f"MediBot: {response}\n")
                
            except KeyboardInterrupt:
                print("\n👋 Session ended by user. Goodbye!")
                break
            except Exception as e:
                print(f"MediBot: Sorry, I encountered an error: {e}\n")

# Simple version without retriever for basic functionality
class SimpleMediBot:
    """
    Simplified version that works without RAG retriever
    """
    def __init__(self):
        self.llm = ReasoningLLM()
        print("🤖 Simple MediBot ready!\n")
    
    def ask(self, query: str) -> str:
        """
        Ask without context retrieval - uses LLM's general knowledge
        """
        try:
            return self.llm.ask(query, "")
        except Exception as e:
            print(f"LLM ERROR: {e}")
            return "Unable to answer right now. Please try again later."
    
    def chat(self):
        """
        Interactive chat for simple bot
        """
        print("🏥 Simple MediBot - Basic Hospital Management Assistant")
        print("Type 'exit' to quit.\n")
        
        while True:
            user = input("You: ").strip()
            if user.lower() in ("exit", "quit"):
                print("👋 Goodbye!")
                break
                
            response = self.ask(user)
            print(f"\nMediBot: {response}\n")