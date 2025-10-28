import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { LogoIcon } from '../constants';

const HomePage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // FIX: Capture input value before clearing it to prevent sending an empty prompt.
        // Also, combine multiple state updates into one for better performance and to avoid race conditions.
        const currentInput = input;
        const userMessage: Message = { sender: 'user', text: currentInput };
        const thinkingMessage: Message = { sender: 'ai', text: '...', isThinking: true };
        setMessages(prev => [...prev, userMessage, thinkingMessage]);
        setInput('');
        setIsLoading(true);

        const response = await generateChatResponse(currentInput);
        
        setMessages(prev => prev.map(msg => msg.isThinking ? { sender: 'ai', text: response } : msg));
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">SnakeEngine.AI</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Your all-in-one AI platform. Start chatting below or explore our powerful tools.</p>
            </div>
            
            <div className="w-full max-w-4xl h-[60vh] bg-white rounded-2xl shadow-lg flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="flex flex-col space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && (
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                                       <LogoIcon className="h-6 w-6 text-white"/>
                                    </div>
                                )}
                                <div className={`max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                    {msg.isThinking ? (
                                        <div className="flex items-center space-x-1">
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        </div>
                                    ) : (
                                        <p className="text-sm">{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full py-3 pl-4 pr-16 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HomePage;