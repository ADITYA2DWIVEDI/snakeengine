import React from 'react';
import { Conversation } from '../types';
import { TrashIcon, ChatIcon, PlusIcon } from '../components/Icons';

interface ChatHistoryPageProps {
    conversations: Conversation[];
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    onNewChat: () => void;
}

export const ChatHistoryPage: React.FC<ChatHistoryPageProps> = ({ conversations, onSelectConversation, onDeleteConversation, onNewChat }) => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Chat History</h1>
                    <p className="text-text-secondary mt-1">Review your past conversations.</p>
                </div>
                <button onClick={onNewChat} className="flex items-center justify-center gap-2 py-2 px-4 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all duration-200 hover:shadow-glow-purple">
                    <PlusIcon className="w-5 h-5" /> New Chat
                </button>
            </header>

            <div className="space-y-4">
                {conversations.length > 0 ? conversations.map(c => (
                    <div key={c.id} className="group relative flex items-center justify-between p-4 rounded-2xl glass-pane transition-all duration-300 hover:border-brand-purple/50 hover:shadow-xl">
                        <button onClick={() => onSelectConversation(c.id)} className="flex items-center gap-4 text-left flex-1">
                            <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-brand-purple">
                                <ChatIcon />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">{c.title}</h3>
                                <p className="text-sm text-text-secondary line-clamp-1">
                                    {c.messages[c.messages.length - 1]?.text || 'No messages yet...'}
                                </p>
                            </div>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteConversation(c.id);
                            }} 
                            className="p-2 rounded-md text-slate-400 hover:bg-red-500/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" 
                            aria-label="Delete chat"
                        >
                            <TrashIcon className="w-5 h-5"/>
                        </button>
                    </div>
                )) : (
                    <div className="text-center py-16">
                        <p className="text-text-secondary">No chat history found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};