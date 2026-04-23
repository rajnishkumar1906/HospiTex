import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

const MediBot = () => {
  const { api, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { role: 'bot', text: 'Hello! I am MediBot, your AI healthcare assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Only show for patients
  if (user?.role !== 'Patient') {
    return null;
  }

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chat, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', text: message };
    setChat(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/bot/chat', {
        message: message
      });

      if (response.data.success) {
        setChat(prev => [...prev, { role: 'bot', text: response.data.data.answer }]);
      } else {
        setChat(prev => [...prev, { role: 'bot', text: "I'm sorry, I'm having trouble connecting right now." }]);
      }
    } catch (error) {
      console.error('MediBot Error:', error);
      const errorMessage = error.response?.data?.message || "I encountered an error. Please ensure MediBot service is running.";
      setChat(prev => [...prev, { role: 'bot', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 transition-all z-[9999] hover:scale-110 active:scale-95 flex items-center gap-2 group animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out font-medium whitespace-nowrap">
            Ask MediBot
          </span>
        </button>
      )}

      {/* Centered Modal Popup (60% of screen) */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-[60vw] h-[60vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-primary-600 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">MediBot AI</h3>
                  <p className="text-xs text-primary-100">Your Medical Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
              {chat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-4 rounded-2xl flex gap-3 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.role === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-primary-600" />
                      </div>
                    )}
                    <p className="text-base leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-2 items-center">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Footer */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-gray-100">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about your health or hospital services..."
                  className="flex-1 px-6 py-4 bg-gray-100 border-none rounded-2xl text-lg focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="px-6 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-primary-200"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-3">
                MediBot can provide general information but is not a substitute for professional medical advice.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MediBot;
