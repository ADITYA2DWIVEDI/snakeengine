
import React, { useState, useRef, useEffect } from 'react';
import { Page, ChatMessage as ChatMessageType } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

// --- TYPES ---
type ViewState = 'home' | 'waiting' | 'in_chat';


// --- SUB-COMPONENTS ---

const ChatRoom: React.FC<{ roomId: string; onLeave: () => void; }> = ({ roomId, onLeave }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([
        { id: '1', role: 'model', text: `Welcome! You are now connected in room "${roomId}". Start chatting!` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage: ChatMessageType = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate peer response
        setTimeout(() => {
            const modelMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: "That's an interesting point!" };
            setMessages(prev => [...prev, modelMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in">
            <div className="flex-shrink-0 p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <button onClick={onLeave} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2 text-sm">
                    <Icon name="back-arrow" className="w-5 h-5"/> Leave Chat
                </button>
                <div className="flex items-center gap-2 text-xs font-semibold text-green-600 dark:text-green-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    P2P Connected
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                 {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 my-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0 flex items-center justify-center text-xs text-slate-500 dark:text-slate-300">P</div>}
                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-white dark:bg-slate-700'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                 ))}
                 {isTyping && (
                    <div className="flex items-end gap-2 my-2 justify-start">
                        <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0"></div>
                        <div className="max-w-md p-3 rounded-lg bg-white dark:bg-slate-700 flex items-center gap-1">
                           <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                           <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                           <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="relative">
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="w-full bg-white dark:bg-slate-700 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600"><Icon name="send" className="w-5 h-5"/></button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN VIEW ---

const LiveChatPlatformView: React.FC = () => {
    const [view, setView] = useState<ViewState>('home');
    const [roomId, setRoomId] = useState<string>('');
    const [joinId, setJoinId] = useState<string>(''); // For the join input field
    const [error, setError] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);

    const generateRoomId = () => `snake-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;

    const handleCreateRoom = () => {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        setView('waiting');
        
        // Simulate waiting for someone to join
        setTimeout(() => {
            if (view === 'waiting') { // a peer "joined"
                 setView('in_chat');
            }
        }, 10000); // Wait 10 seconds for simulation
    };

    const handleJoinRoom = () => {
        if (!joinId.trim()) {
            setError('Please enter a valid Room ID.');
            return;
        }
        setRoomId(joinId);
        setView('in_chat');
        setError('');
    };

    const handleLeave = () => {
        setView('home');
        setRoomId('');
        setJoinId('');
        setError('');
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(roomId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
    
    if (view === 'in_chat') {
        return <ChatRoom roomId={roomId} onLeave={handleLeave} />;
    }

    if (view === 'waiting') {
        return (
             <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Room is Ready</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Share this ID with a peer to start chatting:</p>
                    <div className="my-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg font-mono text-lg tracking-wider text-slate-700 dark:text-slate-200 flex items-center justify-between">
                        <span>{roomId}</span>
                        <button onClick={handleCopy} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Icon name={isCopied ? 'checkmark' : 'copy'} className={`w-5 h-5 ${isCopied ? 'text-green-500' : ''}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                        <Spinner />
                        <span>Waiting for a peer to join...</span>
                    </div>
                     <button onClick={handleLeave} className="mt-6 text-sm text-slate-500 hover:underline">Cancel</button>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
             <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.LIVE_CHAT_PLATFORM} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">P2P Live Chat</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Create a private room and share the ID, or join a room to start a secure peer-to-peer chat.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                {/* Create Room Card */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
                    <Icon name="microphone-gradient" className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create a Chat Room</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Generate a unique room ID to share with a peer.</p>
                    <button onClick={handleCreateRoom} className="w-full py-3 bg-purple-600 dark:bg-teal-500 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-600 transition-colors">
                        Create New Chat
                    </button>
                </div>

                {/* Join Room Card */}
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
                    <Icon name="enter" className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Join a Chat Room</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Enter a Room ID you've received to connect.</p>
                     <div className="flex gap-2">
                        <input 
                            value={joinId}
                            onChange={e => setJoinId(e.target.value)}
                            placeholder="Enter Room ID..."
                            className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                         <button onClick={handleJoinRoom} className="px-5 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-colors">
                            Join
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LiveChatPlatformView;
