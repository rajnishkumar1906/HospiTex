import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MediBot = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Initial messages for the chatbot
    const [messages, setMessages] = useState([
        { 
            sender: 'bot', 
            text: 'Hi, I\'m MediBot. How can I help you today?' 
        }
    ]);

    // State for user input
    const [input, setInput] = useState('');

    // Function to toggle the chatbot visibility
    const toggleBot = () => setIsOpen(!isOpen);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            sender: 'user', 
            text: input 
        };
        
        const botResponse = {
            sender: 'bot',
            text: 'Thanks for your message. A representative will respond shortly!'
        };

        setMessages(prev => [...prev, userMessage, botResponse]);
        setInput('');
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
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="text-blue-600 hover:text-blue-800">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default MediBot;
