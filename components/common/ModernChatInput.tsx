import * as React from 'react';
import { Icon } from '../icons';
import Spinner from './Spinner';
import 'emoji-picker-element';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'emoji-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                class?: string;
            };
        }
    }
}


interface ModernChatInputProps {
    input: string;
    setInput: (value: string) => void;
    handleSend: (prompt?: string) => void;
    isLoading: boolean;
    placeholder?: string;
    showAttachButton?: boolean;
    onFileSelect?: (file: File) => void;
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
    showAttachButton = true,
    onFileSelect,
    showGroundingOptions,
    useSearch,
    onSearchChange,
    useMaps,
    onMapsChange,
}) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const emojiPickerRef = React.useRef<any>(null);
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = React.useState(false);

    React.useEffect(() => {
        const emojiPicker = emojiPickerRef.current;
        const handleEmojiClick = (event: any) => {
            setInput(input + event.detail.unicode);
        };
        emojiPicker?.addEventListener('emoji-click', handleEmojiClick);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPicker && !emojiPicker.contains(event.target as Node)) {
                setIsEmojiPickerVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            emojiPicker?.removeEventListener('emoji-click', handleEmojiClick);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [input, setInput]);
    
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onFileSelect) {
            onFileSelect(file);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 flex flex-col">
            <div className="flex items-end gap-2">
                <div className="flex items-center gap-0.5 relative">
                    {showAttachButton && (
                         <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full">
                            <Icon name="paperclip" className="w-5 h-5"/>
                        </button>
                    )}
                    {onFileSelect && <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />}
                </div>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={1}
                    className="flex-1 bg-transparent resize-none max-h-48 p-2 text-sm focus:outline-none"
                    disabled={isLoading}
                />
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || (!input.trim() && !onFileSelect)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isLoading ? <Spinner /> : <Icon name="send" className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            {showGroundingOptions && (
                <div className="flex items-center gap-4 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 px-2">
                    <span>Ground with:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={useSearch} onChange={e => onSearchChange && onSearchChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"/>
                        <Icon name="search" className="w-4 h-4"/> Google
                    </label>
                     <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={useMaps} onChange={e => onMapsChange && onMapsChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"/>
                        <Icon name="map" className="w-4 h-4"/> Maps
                    </label>
                </div>
            )}
        </div>
    );
};

export default ModernChatInput;