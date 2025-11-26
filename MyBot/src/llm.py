import os
import json
import requests
import re
import numpy as np
from sentence_transformers import SentenceTransformer

BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

class MultiLLM:
    """
    Enhanced LLM wrapper with multiple model fallbacks and embedding validation
    """
    
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise RuntimeError("Missing OPENROUTER_API_KEY in .env")

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "MediBot"
        }
        
        # List of models to try in order (free tier models)
        self.models = [
            "tngtech/deepseek-r1t2-chimera:free",
            "deepseek/deepseek-chat-v3-0324:free", 
            "mistralai/mistral-small-3.2-24b-instruct:free",
            "google/gemini-2.0-flash-exp:free",
            "meta-llama/llama-3.3-70b-instruct:free",
            "nousresearch/hermes-3-llama-3.1-405b:free",
            "meta-llama/llama-3.2-3b-instruct:free"
        ]
        
        # Initialize embedding model for response validation
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Predefined concise answers for common questions
        self.common_answers = {
            "book appointment": "You can book an appointment through the patient dashboard. Select your preferred doctor and time slot.",
            "how to book": "Go to the Book Appointment section in your patient dashboard, choose a doctor, and select an available time slot.",
            "doctor appointment": "Book appointments through the patient dashboard. Doctors will confirm and you'll receive notifications.",
            "diagnostic test": "Contact diagnostic centers through the diagnostic section. They will schedule your tests and share reports.",
            "emergency": "For emergencies, call our emergency helpline or use the ambulance service from the patient dashboard.",
            "hello": "Hello! I'm MediBot. How can I help you with hospital services today?",
            "hi": "Hello! I'm MediBot. How can I help you with hospital services today?",
            "hey": "Hello! I'm MediBot. How can I help you with hospital services today?"
        }

    def _call_model(self, model, messages, max_tokens=150):
        """Make API call to a specific model"""
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.3,
        }

        try:
            response = requests.post(
                url=BASE_URL,
                headers=self.headers,
                data=json.dumps(payload),
                timeout=30
            )

            response.raise_for_status()
            data = response.json()

            if "choices" not in data:
                raise RuntimeError(f"API Error for {model}: {data}")

            msg = data["choices"][0]["message"]
            content = msg.get("content", "").strip()
            
            return content
            
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"API request failed for {model}: {e}")
        except json.JSONDecodeError:
            raise RuntimeError(f"Invalid JSON response from {model}")

    def _validate_response_quality(self, response, query):
        """
        Validate response quality using embedding similarity
        Returns True if response is good, False if it's generic/negative
        """
        if not response or len(response.strip()) < 10:
            return False
            
        # Check for negative/generic responses
        negative_indicators = [
            "i cannot", "i'm unable", "i don't know", "no information", 
            "not available", "cannot answer", "unable to", "sorry, i",
            "consult local", "check with", "ask experts", "i'm sorry","limit exceed"
        ]
        
        response_lower = response.lower()
        if any(indicator in response_lower for indicator in negative_indicators):
            return False
            
        # Use embedding similarity to check if response is relevant to query
        try:
            query_embedding = self.embedder.encode([query])[0]
            response_embedding = self.embedder.encode([response])[0]
            
            similarity = np.dot(query_embedding, response_embedding) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(response_embedding)
            )
            
            # If similarity is too low, response might be generic
            return similarity > 0.3
            
        except Exception:
            # If embedding fails, use basic length and content check
            return len(response) > 20 and not response.startswith("For")

    def _clean_response(self, text):
        """Remove all formatting and ensure very concise response"""
        if not text:
            return ""
            
        # Remove all markdown symbols
        text = re.sub(r'[*#_\-`]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Split into sentences and take only first 1-2 sentences
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if len(sentences) > 2:
            text = '. '.join(sentences[:2]) + '.'
        elif len(sentences) > 0:
            text = '. '.join(sentences) + ('.' if text and text[-1] not in '.!?' else '')
        
        return text

    def ask(self, query: str, context: str) -> str:
        """
        Get response using multiple LLM fallbacks with quality validation
        """
        if not query or not query.strip():
            return "Please ask a question about hospital services, appointments, or medical assistance."
        
        query = query.strip().lower()
        
        # Check for predefined answers first
        for key, answer in self.common_answers.items():
            if key in query:
                return answer
        
        # Prepare the prompt
        prompt = self._build_prompt(query, context)
        messages = [{"role": "user", "content": prompt}]
        
        # Try each model until we get a good response
        for model in self.models:
            try:
                print(f"🔄 Trying model: {model}")
                raw_response = self._call_model(model, messages)
                cleaned_response = self._clean_response(raw_response)
                
                # Validate response quality
                if self._validate_response_quality(cleaned_response, query):
                    print(f"✅ Good response from {model}")
                    return cleaned_response
                else:
                    print(f"⚠️ Poor quality response from {model}, trying next...")
                    continue
                    
            except Exception as e:
                print(f"❌ {model} failed: {e}")
                continue
        
        # If all models fail, return fallback response
        return self._get_fallback_response(query)

    def _build_prompt(self, query: str, context: str) -> str:
        """Build the prompt for the LLM"""
        if context and "NO CONTEXT" not in context:
            return f"""You are MediBot, a hospital management assistant. Answer in 1-2 short sentences maximum. No formatting.

Context: {context}
Question: {query}

Short practical answer:"""
        else:
            return f"""You are MediBot, a hospital management assistant. Answer in 1-2 short sentences maximum. No formatting.

Question: {query}

Short practical answer:"""

    def _get_fallback_response(self, query: str) -> str:
        """Generate a fallback response when all models fail"""
        # Try to categorize the query and give relevant fallback
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['appointment', 'book', 'schedule', 'doctor']):
            return "Book appointments through the patient dashboard. Select your doctor and preferred time slot."
        elif any(word in query_lower for word in ['diagnostic', 'test', 'lab', 'report']):
            return "Contact diagnostic centers through the diagnostic section to schedule tests and view reports."
        elif any(word in query_lower for word in ['emergency', 'ambulance', 'urgent']):
            return "For emergencies, use the ambulance service from the patient dashboard or call the emergency helpline."
        elif any(word in query_lower for word in ['prescription', 'medicine', 'medication']):
            return "Doctors provide prescriptions after consultations. Check your patient records for prescription details."
        elif any(word in query_lower for word in ['report', 'result', 'diagnosis']):
            return "View your diagnostic reports and medical records in the patient dashboard."
        else:
            return "For hospital services, use the patient dashboard to book appointments, contact doctors, or access diagnostic services."

# Backward compatibility
class ReasoningLLM(MultiLLM):
    """Backward compatibility wrapper"""
    pass

# Simple testing
if __name__ == "__main__":
    llm = MultiLLM()
    
    test_questions = [
        "What is irrigation?",
        "Best crops for black soil",
        "How to control pests naturally",
        "What is the meaning of life?"  # This should trigger fallback
    ]
    
    for question in test_questions:
        print(f"\nQ: {question}")
        answer = llm.ask(question, "")
        print(f"A: {answer}")