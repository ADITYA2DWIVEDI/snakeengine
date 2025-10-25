import * as React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { startChat, sendMessage } from '../../services/geminiService';
import { Chat } from '@google/genai';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import ChatMessage from '../common/ChatMessage';
import ModernChatInput from '../common/ModernChatInput';

const HomeView: React.FC = () => {
    const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const chatRef = React.useRef<Chat | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        chatRef.current = startChat();
        setMessages([{ 
            id: 'init', 
            role: 'model', 
            text: 'Hello! I am SnakeEngine AI. How can I help you today?' 
        }]);
    }, []);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSend = React.useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessageType = { 
            id: Date.now().toString(), 
            role: 'user', 
            text: input,
        };
        setMessages(prev => [...prev, userMessage]);
        
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            if (!chatRef.current) chatRef.current = startChat();
            const result = await sendMessage(chatRef.current, currentInput);
            const responseText = result.text;
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: `Sorry, I encountered an error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    return (
        <div className="max-w-3xl mx-auto w-full h-full flex flex-col animate-fade-in">
            <header className="text-center py-6 flex-shrink-0">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100">
                    Welcome to <span className="gradient-text">SnakeEngine.AI</span>
                </h1>
                <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
                    Your all-in-one AI platform. Start chatting below or explore our powerful tools.
                </p>
            </header>
            
            <main className="flex-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-t-2xl shadow-xl overflow-hidden flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
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
                
                <div className="p-4 bg-white/70 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-700">
                     <ModernChatInput
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                        isLoading={isLoading}
                        showAttachButton={false}
                        showGroundingOptions={false}
                    />
                </div>
            </main>
        </div>
    );
};

export default HomeView;
