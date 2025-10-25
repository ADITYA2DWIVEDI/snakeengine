

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../icons';

// Mock Data
const users = {
    '1': { name: 'Alex Johnson', avatar: 'A' },
    '2': { name: 'Ben Carter', avatar: 'B' },
    '3': { name: 'Chloe Davis', avatar: 'C' },
    '0': { name: 'You', avatar: 'Y' },
};

const conversations = [
    { id: 'c1', type: 'direct', members: ['1'], name: 'Alex Johnson', unread: 2, messages: [
        { id: 'm1', userId: '1', text: 'Hey, did you see the new designs?', timestamp: '10:30 AM' },
        { id: 'm2', userId: '1', text: 'Let me know what you think!', timestamp: '10:31 AM' },
    ]},
    { id: 'c2', type: 'direct', members: ['2'], name: 'Ben Carter', unread: 0, messages: [
        { id: 'm3', userId: '0', text: 'The server deployment is complete.', timestamp: 'Yesterday' },
        { id: 'm4', userId: '2', text: "Great, I'll start testing now.", timestamp: 'Yesterday' },
    ]},
    { id: 'c3', type: 'group', members: ['1', '3'], name: 'Project Alpha', unread: 0, messages: [
        { id: 'm5', userId: '3', text: "Team, let's sync up at 3 PM today.", timestamp: '9:15 AM' },
    ]},
];


const LiveChatView: React.FC = () => {
    const [selectedConversationId, setSelectedConversationId] = useState('c1');
    const [message, setMessage] = useState('');
    const [mobileListVisible, setMobileListVisible] = useState(true);

    const activeConversation = conversations.find(c => c.id === selectedConversationId);

    const handleSendMessage = () => {
        if (message.trim() && activeConversation) {
            activeConversation.messages.push({
                id: `m${Date.now()}`,
                userId: '0',
                text: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            setMessage('');
        }
    };
    
    const ConversationList = () => (
        <div className={`w-full md:w-80 flex-shrink-0 bg-white dark:bg-slate-800 rounded-2xl shadow-lg md:flex flex-col ${mobileListVisible ? 'flex' : 'hidden'}`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                    <button key={conv.id} onClick={() => { setSelectedConversationId(conv.id); setMobileListVisible(false); }} className={`w-full text-left flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 ${selectedConversationId === conv.id ? 'bg-slate-100 dark:bg-slate-700' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center font-bold text-purple-700 dark:text-purple-300">{conv.name[0]}</div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold truncate">{conv.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{conv.messages.slice(-1)[0].text}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
    
    const ChatWindow = () => {
         const endOfMessagesRef = useRef<HTMLDivElement>(null);
         useEffect(() => {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
         }, [activeConversation?.messages]);

        if (!activeConversation) return <div className="hidden md:flex flex-1 items-center justify-center text-slate-500">Select a conversation to start chatting.</div>;

        return (
            <div className={`flex-1 flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg overflow-hidden ${mobileListVisible ? 'hidden' : 'flex'} md:flex`}>
                <div className="p-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <button onClick={() => setMobileListVisible(true)} className="md:hidden p-2"><Icon name="back-arrow" className="w-5 h-5" /></button>
                    <div className="w-9 h-9 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center font-bold text-purple-700 dark:text-purple-300">{activeConversation.name[0]}</div>
                    <h3 className="font-bold">{activeConversation.name}</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {activeConversation.messages.map(msg => {
                            const user = users[msg.userId as keyof typeof users];
                            const isMe = msg.userId === '0';
                            return (
                                <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!isMe && <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs font-bold">{user?.avatar}</div>}
                                    <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isMe ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-700'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div ref={endOfMessagesRef} />
                </div>
                <div className="p-4 bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-2">
                        <input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 bg-transparent focus:outline-none px-2" />
                        <button onClick={handleSendMessage} className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center flex-shrink-0"><Icon name="send" className="w-4 h-4"/></button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex gap-6">
            <ConversationList />
            <ChatWindow />
        </div>
    );
};

export default LiveChatView;