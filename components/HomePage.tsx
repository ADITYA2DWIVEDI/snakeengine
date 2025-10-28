import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { generateChatResponse } from '../services/geminiService';
import { LogoIcon } from '../constants';
import { useChatHistory } from '../hooks/useChatHistory';

const HomePage: React.FC = () => {
    const { activeChat, createNewChat, setActiveChat } = useChatHistory();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [input]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !activeChat) return;
    
        const currentInput = input;
        const userMessage: Message = { sender: 'user', text: currentInput };
        const thinkingMessage: Message = { sender: 'ai', text: '', isThinking: true };
    
        setActiveChat(prev => {
            if (!prev) return null;
            return { ...prev, messages: [...prev.messages, userMessage, thinkingMessage] };
        });
    
        setInput('');
        setIsLoading(true);
    
        try {
            const response = await generateChatResponse(currentInput);
            
            setActiveChat(prev => {
                if (!prev) return prev;
                const finalMessages = prev.messages.map(msg => 
                    msg.isThinking ? { ...msg, text: response, isThinking: false } as Message : msg
                );
                return { ...prev, messages: finalMessages };
            });
        } catch (error) {
            setActiveChat(prev => {
                if (!prev) return prev;
                const finalMessages = prev.messages.map(msg => 
                    msg.isThinking ? { ...msg, text: 'Sorry, I encountered an error.', isThinking: false } as Message : msg
                );
                return { ...prev, messages: finalMessages };
            });
        } finally {
            setIsLoading(false);
        }
    };

    const starterPrompts = [
        "Explain quantum computing in simple terms",
        "Give me creative ideas for a 10-year-old’s birthday party",
        "Write a short story about a futuristic detective",
        "What are the best ways to learn a new language?",
    ];

    const handleStarterPrompt = (prompt: string) => {
        setInput(prompt);
        // We can't await here, so we manually trigger the form submission in the next event loop
        setTimeout(() => {
            const form = textareaRef.current?.closest('form');
            form?.requestSubmit();
        }, 0);
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-transparent">
            
            <div className="w-full max-w-4xl h-[85vh] md:h-[80vh] flex flex-col">
                
                {(!activeChat || activeChat.messages.length <= 1) ? (
                    <div className="text-center my-auto px-4 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">SnakeEngine.AI</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Your all-in-one AI platform. How can I help you today?</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 max-w-2xl mx-auto">
                            {starterPrompts.map((prompt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleStarterPrompt(prompt)}
                                    className="p-4 bg-white/5 dark:bg-gray-800/50 rounded-xl text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/60 transition-colors border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 p-2 sm:p-6 overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            {activeChat.messages.map((msg, index) => (
                                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'ai' && (
                                        <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg ${msg.isThinking ? 'animate-pulse-glow' : ''}`}>
                                        <LogoIcon className="h-6 w-6 text-white"/>
                                        </div>
                                    )}
                                    <div className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                        {msg.isThinking ? (
                                            <div className="flex items-center space-x-1.5">
                                                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                                            </div>
                                        ) : (
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                )}
                
                <div className="p-4 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="w-full max-w-4xl mx-auto">
                         <div className="relative flex items-center p-2 bg-white/80 dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm focus-within:ring-2 focus-within:ring-purple-500 transition-shadow">
                            <button type="button" onClick={createNewChat} className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" title="New Chat">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            </button>
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-grow py-2 px-3 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none resize-none max-h-40"
                                rows={1}
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HomePage;