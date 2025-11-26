import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

const MediBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatId, setChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initial messages for the chatbot
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: 'Hi, I\'m MediBot. How can I help you today?' 
        }
    ]);

    // State for user input
    const [input, setInput] = useState('');

    // MediBot API URL (through HospiTex-Server proxy)
    const API_URL = 'http://localhost:5000/medibot';

    // Initialize chat when component mounts or bot opens
    useEffect(() => {
        if (isOpen && !chatId) {
            initializeChat();
        }
    }, [isOpen]);

    const initializeChat = async () => {
        try {
            const response = await axios.get(`${API_URL}/chat/new`);
            if (response.data && response.data.chat_id) {
                setChatId(response.data.chat_id);
            }
        } catch (error) {
            console.error('Failed to initialize chat:', error);
        }
    };

    // Function to toggle the chatbot visibility
    const toggleBot = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            sender: 'user', 
            text: input 
        };

        // Add user message immediately
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Ensure we have a chat ID
            let currentChatId = chatId;
            if (!currentChatId) {
                const chatResponse = await axios.get(`${API_URL}/chat/new`);
                currentChatId = chatResponse.data.chat_id;
                setChatId(currentChatId);
            }

            // Send question to Flask backend
            const response = await axios.post(`${API_URL}/ask`, {
                question: input,
                chat_id: currentChatId
            });

            const botResponse = {
                sender: 'bot',
                text: response.data.answer || 'Sorry, I couldn\'t process your request. Please try again.'
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorResponse = {
                sender: 'bot',
                text: 'Sorry, I\'m having trouble connecting. Please check if the MediBot server is running.'
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button with MediBot image */}
            <button
                onClick={toggleBot}
                className="fixed bottom-6 right-6 p-1 rounded-full shadow-lg hover:scale-115 transition-transform duration-200 z-50"
            >
                <img
                    src="/Pictures/Medibot.png"
                    alt="MediBot"
                    className="w-16 h-16 object-contain rounded-full border border-gray-300"
                />
            </button>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col z-50">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-800 text-white p-3 rounded-t-lg font-semibold">
                        MediBot 🤖
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50 text-sm">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start`}>
                                {msg.sender === 'bot' && (
                                    <img
                                        src="/Pictures/Medibot.png"
                                        alt="MediBot"
                                        className="w-5 h-5 rounded-full mr-2 border"
                                    />
                                )}
                                <div
                                    className={`p-2 rounded-lg max-w-[70%] ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-blue-200'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="p-2 border-t flex items-center space-x-2">
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded"
                            placeholder={isLoading ? "MediBot is thinking..." : "Ask me anything..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            disabled={isLoading}
                        />
                        <button 
                            onClick={handleSend} 
                            disabled={isLoading}
                            className={`text-blue-600 hover:text-blue-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MediBot;
