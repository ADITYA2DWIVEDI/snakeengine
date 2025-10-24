


import React, { useState, useEffect, useRef } from 'react';
import { Page, Feature, ChatMessage as ChatMessageType } from '../../types';
import { Icon } from '../icons';
import { Chat } from '@google/genai';
import { startChat, sendMessage } from '../../services/geminiService';
import ChatMessage from '../common/ChatMessage';
import ModernChatInput from '../common/ModernChatInput';
import Spinner from '../common/Spinner';


interface HomeViewProps {
    setActivePage: (page: Page, subPage?: Feature) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setActivePage }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatHistoryKey = 'snakeEngineHomeChatHistory';

    // Load chat history from localStorage on initial render
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(chatHistoryKey);
            if (savedHistory) {
                setMessages(JSON.parse(savedHistory));
            } else {
                 setMessages([{ id: 'init', role: 'model', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]);
            }
        } catch (error) {
             console.error("Could not load chat history from localStorage.", error);
             setMessages([{ id: 'init', role: 'model', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]);
        }
        chatRef.current = startChat();
    }, []);

    // Save chat history to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            try {
                localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
            } catch (error) {
                console.error("Could not save chat history to localStorage.", error);
            }
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (prompt?: string) => {
        const currentInput = prompt || input;
        if (!currentInput.trim() || isLoading) return;

        const userMessage: ChatMessageType = { id: Date.now().toString(), role: 'user', text: currentInput };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!chatRef.current) {
                chatRef.current = startChat();
            }
            const result = await sendMessage(chatRef.current, currentInput);
            const modelMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error: any) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: `Sorry, I encountered an error: ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };


    const FeatureCard: React.FC<{ page: Page, title: string, description: string, subPage?: Feature, icon?: Page | Feature }> = ({ page, title, description, subPage, icon }) => (
        <button 
            onClick={() => setActivePage(page, subPage)}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left w-full border border-slate-200 dark:border-slate-700"
        >
            <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-slate-700 flex items-center justify-center text-purple-600 dark:text-teal-400 flex-shrink-0">
                    <Icon name={icon || page} className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-md font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
        </button>
    );

    return (
        <div className="h-full flex flex-col md:flex-row gap-8 animate-fade-in">
            {/* Left Column */}
            <div className="w-full md:w-1/3 flex flex-col">
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                    Welcome to <span className="gradient-text">SnakeEngine.AI</span>
                </h1>
                <p className="text-md text-slate-500 dark:text-slate-400 mb-8">Your all-in-one AI platform. Start chatting below or explore our powerful tools.</p>
                <div className="space-y-4">
                    <FeatureCard 
                        page={Page.BUILD_EVERYTHING}
                        icon={Page.BUILD_EVERYTHING}
                        title="Build Everything"
                        description="Access the full suite of tools: Voice, Image, Video, and more."
                    />
                </div>
            </div>

             {/* Right Column - Chat */}
             <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg">
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                    {isLoading && (
                        <div className="flex justify-start gap-4 my-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex-shrink-0 flex items-center justify-center">
                                <Icon name="logo" className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white dark:bg-slate-700 p-4 rounded-xl flex items-center shadow-sm">
                               <Spinner />
                               <span className="ml-3 text-slate-500 dark:text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                 <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-b-2xl">
                     <ModernChatInput
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                        isLoading={isLoading}
                        placeholder="Type your message..."
                        showMicButton={true}
                        onMicClick={() => setActivePage(Page.BUILD_EVERYTHING, Feature.LIVE_VOICE)}
                        showAttachButton={true}
                        onAttachClick={() => setActivePage(Page.BUILD_EVERYTHING, Feature.FILE_ANALYSIS)}
                        suggestedReplies={messages.length <= 1 ? ["Yes, please!", "Maybe later", "Tell me more!"] : undefined}
                    />
                </div>
             </div>
        </div>
    );
};

export default HomeView;