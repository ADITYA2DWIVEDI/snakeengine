/// <reference types="react" />
import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { Icon } from '../icons';

interface ChatMessageProps {
    message: ChatMessageType;
    onPlayAudio?: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onPlayAudio }) => {
    const isModel = message.role === 'model';
    
    return (
        <div className={`flex gap-3 my-4 animate-fade-in-up ${isModel ? 'justify-start' : 'justify-end'}`}>
            {isModel && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex-shrink-0 flex items-center justify-center shadow-md">
                    <Icon name="logo" className="w-5 h-5 text-white" />
                </div>
            )}
            <div className={`group relative max-w-xl p-4 rounded-2xl shadow-sm ${
                isModel 
                ? 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-lg' 
                : 'bg-gradient-to-r from-purple-500 to-teal-500 text-white rounded-tr-lg'
            }`}>
                {message.image && <img src={message.image} alt="User upload" className="mb-2 rounded-lg max-w-full" />}
                {message.video && <video src={message.video} controls className="mb-2 rounded-lg max-w-full" />}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>

                {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 border-t border-slate-200 dark:border-slate-600 pt-2">
                        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Sources:</h4>
                        <ul className="text-xs space-y-1">
                            {message.sources.map((source, index) => (
                                <li key={index}>
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-purple-500 dark:text-teal-400 hover:underline truncate block">
                                        {source.title || source.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {isModel && onPlayAudio && message.text && (
                    <button 
                        onClick={() => onPlayAudio(message.text)}
                        className="absolute bottom-2 right-2 p-1 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Play audio"
                    >
                        <Icon name="speaker" className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;