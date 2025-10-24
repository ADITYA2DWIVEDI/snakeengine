



import React, { useRef, useState, useEffect } from 'react';
import { Icon } from '../icons';
import Spinner from './Spinner';
import 'emoji-picker-element';

// Fix: Use a more explicit type declaration for the 'emoji-picker' custom element.
// This resolves the issue where TypeScript was not recognizing the custom element tag
// by defining its properties in a dedicated interface.
interface EmojiPickerProps extends React.HTMLAttributes<HTMLElement> {
  // Custom element properties can be added here if needed
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'emoji-picker': React.DetailedHTMLProps<EmojiPickerProps, HTMLElement>;
        }
    }
}


interface ModernChatInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSend: (prompt?: string) => void;
    isLoading: boolean;
    placeholder?: string;
    showMicButton?: boolean;
    onMicClick?: () => void;
    showAttachButton?: boolean;
    onAttachClick?: () => void; // For navigation
    onFileSelect?: (file: File) => void; // For file uploads
    suggestedReplies?: string[];
    showGroundingOptions?: boolean;
    useSearch?: boolean;
    onSearchChange?: (checked: boolean) => void;
    useMaps?: boolean;
    onMapsChange?: (checked: boolean) => void;
}

const ModernChatInput: React.FC<ModernChatInputProps> = ({
    input,
    setInput,
    handleSend,
    isLoading,
    placeholder = "Type your message...",
    showMicButton = true,
    onMicClick,
    showAttachButton = true,
    onAttachClick,
    onFileSelect,
    suggestedReplies,
    showGroundingOptions,
    useSearch,
    onSearchChange,
    useMaps,
    onMapsChange,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSend(input);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && onFileSelect) {
            onFileSelect(e.target.files[0]);
        }
        e.target.value = '';
    };

    const handleAttachClick = () => {
        if (onFileSelect) {
            fileInputRef.current?.click();
        } else if (onAttachClick) {
            onAttachClick();
        }
    };
    
    const handleSuggestionClick = (reply: string) => {
        handleSend(reply);
    };

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            {suggestedReplies && suggestedReplies.length > 0 && !isLoading && (
                <div className="flex items-start flex-wrap gap-2 animate-fade-in">
                    <button onClick={() => handleSuggestionClick(suggestedReplies[0])} className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white dark:bg-slate-800 border border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700">
                        {suggestedReplies[0]}
                    </button>
                    <button onClick={() => handleSuggestionClick(suggestedReplies[1])} className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900">
                        {suggestedReplies[1]}
                    </button>
                     <button onClick={() => handleSuggestionClick(suggestedReplies[2])} className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        {suggestedReplies[2]}
                    </button>
                </div>
            )}
            <div className="relative w-full flex items-end gap-2">
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-full shadow-xl p-2 flex items-end gap-1">
                    {showMicButton && (
                        <button onClick={onMicClick} className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Use voice input">
                            <Icon name="microphone-gradient" className="w-6 h-6" />
                        </button>
                    )}
                    {showAttachButton && (
                        <>
                            <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={handleAttachClick} className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-red-400 to-pink-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Attach a file">
                                <Icon name="edit" className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-2.5 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none overflow-y-auto max-h-40"
                    />
                    
                    <button onClick={() => handleSend(input)} disabled={isLoading || (!input.trim() && !onFileSelect)} className="w-10 h-10 flex-shrink-0 self-end rounded-full bg-gradient-to-br from-teal-400 to-green-500 text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">
                        {isLoading ? <Spinner /> : <Icon name="send" className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {showGroundingOptions && (
                <div className="w-full flex items-center justify-between mt-2 px-2">
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={useSearch} 
                                onChange={(e) => onSearchChange?.(e.target.checked)} 
                                className="w-4 h-4 rounded text-purple-600 dark:text-teal-500 focus:ring-purple-500 dark:focus:ring-teal-500 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                            />
                             <Icon name="search" className="w-4 h-4" />
                            <span>Web Search</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={useMaps} 
                                onChange={(e) => onMapsChange?.(e.target.checked)} 
                                className="w-4 h-4 rounded text-purple-600 dark:text-teal-500 focus:ring-purple-500 dark:focus:ring-teal-500 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                            />
                            <Icon name="map" className="w-4 h-4" />
                            <span>Maps</span>
                        </label>
                    </div>
                    <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                        <Icon name="google" className="w-5 h-5"/>
                        <span className="font-semibold">Google</span>
                        <Icon name="chevron-right" className="w-3 h-3"/>
                    </a>
                </div>
            )}
        </div>
    );
};

export default ModernChatInput;