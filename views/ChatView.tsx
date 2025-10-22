import React, { useState, useEffect, useRef, useMemo } from 'react';
import { sendMessage, fileToGenerativePart, generateTitleForConversation } from '../services/geminiService';
import { SendIcon, PaperclipIcon, UserIcon, AILogoIcon, LogoIcon, CodeIcon } from '../components/Icons';
import { Part } from '@google/genai';
import { ChatMessage as Message, Conversation } from '../types';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MAX_INPUT_LENGTH = 4096;

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : ''}`}>
            <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${isUser ? 'bg-brand-purple' : 'bg-slate-200 text-brand-purple'}`}>
                {isUser ? <UserIcon className="w-5 h-5 text-white" /> : <AILogoIcon className="w-6 h-6 p-0.5" />}
            </div>
            <div className={`p-4 rounded-2xl max-w-xl shadow-lg ${isUser ? 'bg-brand-purple text-white rounded-br-none' : 'glass-pane rounded-bl-none text-text-primary'}`}>
                {message.imageUrls && message.imageUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {message.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`attachment ${index + 1}`} className="max-w-xs max-h-48 rounded-lg" />
                        ))}
                    </div>
                )}
                {message.text ? (
                     <div className="prose prose-sm text-slate-600 prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-slate-900">
                        <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>
                    </div>
                ) : (
                    <div className="flex space-x-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse animation-delay-0"></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ChatViewProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    updateConversationMessages: (conversationId: string, updateFn: (messages: Message[]) => Message[]) => void;
    updateConversationTitle: (conversationId: string, title: string) => void;
    onUpdateConversationModel: (conversationId: string, model: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ 
    conversations, 
    activeConversationId, 
    updateConversationMessages,
    updateConversationTitle,
    onUpdateConversationModel
}) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const availableModels = [
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' }
    ];

    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId);
    }, [conversations, activeConversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAttachedFiles(prev => [...prev, ...Array.from(event.target.files ?? [])]);
            if(event.target) event.target.value = '';
        }
    };

    const handleSend = async () => {
        if (!input.trim() && attachedFiles.length === 0 || !activeConversationId) return;

        const userMessageText = input;
        const userImageUrls = attachedFiles.map(file => URL.createObjectURL(file));

        const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: userMessageText, imageUrls: userImageUrls };
        updateConversationMessages(activeConversationId, messages => [...messages, userMessage]);
        
        setInput('');
        setIsLoading(true);

        const imageParts: Part[] = await Promise.all(attachedFiles.map(file => fileToGenerativePart(file)));
        setAttachedFiles([]);

        const aiResponseId = (Date.now() + 1).toString();
        const aiMessagePlaceholder: Message = { id: aiResponseId, sender: 'ai', text: '' };
        updateConversationMessages(activeConversationId, messages => [...messages, aiMessagePlaceholder]);

        try {
            const modelToUse = activeConversation?.model || 'gemini-2.5-flash';
            const personaToUse = activeConversation?.persona;
            const stream = await sendMessage(activeConversationId, userMessageText, imageParts, personaToUse, modelToUse);
            
            let accumulatedText = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                accumulatedText += chunkText;
                updateConversationMessages(activeConversationId, messages => 
                    messages.map(msg => msg.id === aiResponseId ? { ...msg, text: accumulatedText } : msg)
                );
            }

            if (activeConversation?.messages.length <= 2 && activeConversation.title === "SnakeEngine.AI" && accumulatedText) { // This is the first real exchange
                const newTitle = await generateTitleForConversation(userMessageText, accumulatedText);
                updateConversationTitle(activeConversationId, newTitle);
            }

        } catch (error) {
            console.error("Error sending message:", error);
            updateConversationMessages(activeConversationId, messages => messages.map(msg => msg.id === aiResponseId ? { ...msg, text: "Sorry, I encountered an error. Please try again. 😕" } : msg));
        } finally {
            setIsLoading(false);
        }
    };

    if (!activeConversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 bg-black rounded-2xl shadow-md flex items-center justify-center p-2.5 text-brand-purple mx-auto">
                    <LogoIcon />
                </div>
                <h1 className="mt-6 text-4xl font-bold text-text-primary">SnakeEngine.AI</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 h-full p-4 md:p-6">
            <header className="mb-6 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary truncate">{activeConversation.title}</h1>
                        <p className="text-text-secondary mt-1 text-sm">Your intelligent assistant for any task.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="model-select" className="text-sm font-medium text-text-secondary sr-only">Select Model</label>
                        <div className="relative">
                            <CodeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                id="model-select"
                                value={activeConversation.model || 'gemini-2.5-flash'}
                                onChange={(e) => onUpdateConversationModel(activeConversation.id, e.target.value)}
                                className="pl-10 pr-4 py-2 text-sm font-medium bg-white/80 backdrop-blur-sm border border-border-color rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-brand-purple text-text-primary"
                            >
                                {availableModels.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 -mr-2">
                {activeConversation.messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
                {isLoading && !activeConversation.messages.find(m => m.sender === 'ai' && m.text === '') &&
                    <ChatMessage message={{id: 'thinking', sender: 'ai', text: ''}}/>
                }
                <div ref={messagesEndRef} />
            </div>

            <div className="mt-6 flex-shrink-0">
                {attachedFiles.length > 0 && (
                     <div className="mb-2 p-3 bg-slate-100 rounded-lg space-y-2 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Attachments ({attachedFiles.length})</h4>
                            <button onClick={() => setAttachedFiles([])} className="text-xs text-brand-red font-semibold hover:underline">Clear all</button>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {attachedFiles.map((file, index) => (
                               <div key={index} className="text-xs bg-white p-1.5 rounded flex items-center gap-1.5 text-slate-700 border border-slate-200">
                                   <PaperclipIcon className="w-3 h-3 flex-shrink-0" />
                                   <span className="truncate max-w-[120px]">{file.name}</span>
                               </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                        placeholder="Type your message or attach a file..."
                        className="w-full p-4 pr-14 pl-12 glass-pane rounded-2xl focus:ring-2 focus:ring-brand-purple/80 focus:outline-none transition-all duration-300 resize-none shadow-lg text-text-primary placeholder:text-slate-400"
                        rows={1}
                        disabled={isLoading}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
                         <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-brand-purple transition-colors" disabled={isLoading} aria-label="Attach file">
                            <PaperclipIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button onClick={handleSend} disabled={isLoading || (!input.trim() && attachedFiles.length === 0)} className="p-2.5 bg-gradient-to-br from-brand-purple to-brand-pink text-white rounded-full shadow-lg hover:shadow-glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-110">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                 <div className="text-right text-xs mt-1.5 pr-2">
                    <span className={`font-medium ${
                        input.length >= MAX_INPUT_LENGTH
                            ? 'text-brand-red'
                            : input.length > MAX_INPUT_LENGTH * 0.9
                            ? 'text-orange-500'
                            : 'text-slate-400'
                    }`}>
                        {input.length} / {MAX_INPUT_LENGTH}
                    </span>
                </div>
            </div>
        </div>
    );
};