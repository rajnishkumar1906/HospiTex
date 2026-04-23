import os
import json
import requests
import re
import numpy as np
from sentence_transformers import SentenceTransformer

from dotenv import load_dotenv
load_dotenv()

BASE_URL = \"https://openrouter.ai/api/v1/chat/completions\"

class MultiLLM:
    \"\"\"Enhanced LLM wrapper with multiple model fallbacks and embedding validation\"\"\"
    
    def __init__(self):
        self.api_key = os.getenv(\"OPENROUTER_API_KEY\")
        if not self.api_key:
            print(\"⚠️  OPENROUTER_API_KEY not found in .env\" )
            print(\"💡 Get a free API key from: https://openrouter.ai/\" )
            self.api_key = \"dummy_key\"

        self.headers = {
            \"Authorization\": f\"Bearer {self.api_key}\",
            \"Content-Type\": \"application/json\",
            \"HTTP-Referer\": \"http://localhost:5173\",
            \"X-Title\": \"HospiTex MediBot\"
        }
        
        # List of models to try in order (free tier models)
        self.models = [
            \"google/gemini-2.0-flash-exp:free\",
            \"google/gemini-2.0-flash-lite-preview-02-05:free\",
            \"deepseek/deepseek-r1:free\",
            \"mistralai/mistral-small-24b-instruct-2501:free\",
            \"meta-llama/llama-3.3-70b-instruct:free\"
        ]
        
        # Initialize embedding model for response validation
        try:
            self.embedder = SentenceTransformer(\"all-MiniLM-L6-v2\")
        except Exception as e:
            print(f\"⚠️  Embedding model not available: {e}\")
            self.embedder = None
        
        # Predefined concise answers for common questions
        self.common_answers = {
            \"book appointment\": \"You can book an appointment through the patient dashboard. Select your preferred doctor and time slot.\",
            \"how to book\": \"Go to the Book Appointment section in your patient dashboard, choose a doctor, and select an available time slot.\",
            \"doctor appointment\": \"Book appointments through the patient dashboard. Doctors will confirm and you'll receive notifications.\",
            \"diagnostic test\": \"Contact diagnostic centers through the diagnostic section. They will schedule your tests and share reports.\",
            \"emergency\": \"For emergencies, call our emergency helpline or use the ambulance service from the patient dashboard.\",
            \"hello\": \"Hello! I'm MediBot. How can I help you with hospital services today?\",
            \"hi\": \"Hello! I'm MediBot. How can I help you with hospital services today?\",
            \"hey\": \"Hello! I'm MediBot. How can I help you with hospital services today?\",
            \"help\": \"I can help you with appointments, diagnostic tests, prescriptions, ambulance services, and general hospital inquiries. What do you need?\",
            \"services\": \"HospiTex offers appointment booking, diagnostic tests, ambulance services, prescriptions, and medical records management.\"
        }

    def _call_model(self, model, messages, max_tokens=150):
        \"\"\"Make API call to a specific model\"\"\"
        if self.api_key == \"dummy_key\":
            return self._get_mock_response(messages[0][\"content\"] if messages else \"\")
            
        payload = {
            \"model\": model,
            \"messages\": messages,
            \"max_tokens\": max_tokens,
            \"temperature\": 0.3,
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

            if \"choices\" not in data:
                raise RuntimeError(f\"API Error for {model}: {data}\")

            msg = data[\"choices\"][0][\"message\"]
            content = msg.get(\"content\", \"\").strip()
            
            return content
            
        except requests.exceptions.RequestException as e:
            print(f\"⚠️  API request failed for {model}: {e}\")
            raise RuntimeError(f\"API request failed: {e}\")
        except json.JSONDecodeError:
            raise RuntimeError(f\"Invalid JSON response from {model}\")
    
    def _get_mock_response(self, query):
        \"\"\"Get mock response when no API key is available\"\"\"
        query_lower = query.lower()
        
        if \"appointment\" in query_lower:
            return \"You can book appointments through the patient dashboard. Select your preferred doctor and time slot.\"
        elif \"diagnostic\" in query_lower or \"test\" in query_lower:
            return \"Diagnostic tests can be booked through the diagnostic section. Reports are shared once completed.\"
        elif \"emergency\" in query_lower or \"ambulance\" in query_lower:
            return \"For emergencies, use the ambulance service from the patient dashboard or call our emergency helpline.\"
        elif \"prescription\" in query_lower or \"medicine\" in query_lower:
            return \"Doctors provide prescriptions after consultations. Check your patient records for prescription details.\"
        else:
            return \"I'm MediBot, your hospital assistant. I can help with appointments, diagnostic tests, prescriptions, and ambulance services. How can I assist you today?\"

    def _validate_response_quality(self, response, query):
        \"\"\"Validate response quality using embedding similarity\"\"\"
        if not response or len(response.strip()) < 10:
            return False
            
        # Check for negative/generic responses
        negative_indicators = [
            \"i cannot\", \"i'm unable\", \"i don't know\", \"no information\", 
            \"not available\", \"cannot answer\", \"unable to\", \"sorry, i\"
        ]
        
        response_lower = response.lower()
        if any(indicator in response_lower for indicator in negative_indicators):
            return False
            
        # Basic quality check
        return len(response) > 20

    def _clean_response(self, text):
        \"\"\"Clean response while preserving some structure\"\"\"
        if not text:
            return \"\"
            
        # Remove thinking process if present
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
        text = re.sub(r'\\*\\*', '', text)
            
        # Remove excessive extra whitespace
        text = re.sub(r' +', ' ', text)
        text = re.sub(r'\\n{3,}', '\\n\\n', text).strip()
        
        return text

    def ask(self, query: str, context: str) -> str:
        \"\"\"Get response using multiple LLM fallbacks with quality validation\"\"\"
        if not query or not query.strip():
            return \"Please ask a question about hospital services, appointments, or medical assistance.\"
        
        query = query.strip().lower()
        
        # Check for predefined answers first
        for key, answer in self.common_answers.items():
            if key in query:
                return answer
        
        # Prepare the prompt
        prompt = self._build_prompt(query, context)
        messages = [{\"role\": \"user\", \"content\": prompt}]
        
        # Try each model until we get a good response
        for model in self.models:
            try:
                print(f\"🔄 Trying model: {model}\")
                raw_response = self._call_model(model, messages)
                cleaned_response = self._clean_response(raw_response)
                
                # Validate response quality
                if self._validate_response_quality(cleaned_response, query):
                    print(f\"✅ Good response from {model}\")
                    return cleaned_response
                else:
                    print(f\"⚠️  Poor quality response from {model}, trying next...\")
                    continue
                    
            except Exception as e:
                print(f\"❌ {model} failed: {e}\")
                continue
        
        # If all models fail, return fallback response
        return self._get_fallback_response(query)

    def _build_prompt(self, query: str, context: str) -> str:
        \"\"\"Build the prompt for the LLM\"\"\"
        if context and \"NO CONTEXT\" not in context and len(context) > 10:
            return f\"\"\"You are MediBot, a hospital management assistant. Answer in 1-2 short sentences maximum. No markdown or formatting.

Context: {context}
Question: {query}

Short practical answer:\"\"\"
        else:
            return f\"\"\"You are MediBot, a hospital management assistant for HospiTex. Answer in 1-2 short sentences maximum. Be helpful and concise.

Question: {query}

Short helpful answer:\"\"\"

    def _get_fallback_response(self, query: str) -> str:
        \"\"\"Generate a fallback response when all models fail\"\"\"
        query_lower = query.lower()
        
        if any(word in query_lower for word in ['appointment', 'book', 'schedule', 'doctor']):
            return \"Book appointments through the patient dashboard. Select your doctor and preferred time slot.\"
        elif any(word in query_lower for word in ['diagnostic', 'test', 'lab', 'report']):
            return \"Contact diagnostic centers through the diagnostic section to schedule tests and view reports.\"
        elif any(word in query_lower for word in ['emergency', 'ambulance', 'urgent']):
            return \"For emergencies, use the ambulance service from the patient dashboard or call the emergency helpline.\"
        elif any(word in query_lower for word in ['prescription', 'medicine', 'medication']):
            return \"Doctors provide prescriptions after consultations. Check your patient records for prescription details.\"
        elif any(word in query_lower for word in ['help', 'service', 'feature']):
            return \"HospiTex offers appointment booking, diagnostic tests, ambulance services, prescriptions, and medical records. How can I help?\"
        else:
            return \"I'm MediBot, your hospital assistant. I can help with appointments, diagnostic tests, prescriptions, and ambulance services. What would you like to know?\"

# Backward compatibility
class ReasoningLLM(MultiLLM):
    \"\"\"Backward compatibility wrapper\"\"\"
    pass
