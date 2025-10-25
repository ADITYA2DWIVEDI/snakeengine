import React from 'react';
import { ChatMessage as ChatMessageType, GroundingSource, Feature } from '../../../../types';
import { startChat, generateTextWithGrounding, textToSpeech, sendMessage } from '../../../../services/geminiService';
import { Chat } from '@google/genai';
import { Icon } from '../../../icons';
import Spinner from '../../../common/Spinner';
import ChatMessage from '../../../common/ChatMessage';
import { decodeAudioData, decodeBase64, fileToBase64 } from '../../../../utils/helpers';
import ModernChatInput from '../../../common/ModernChatInput';

interface SmartChatViewProps {
    initialPrompt?: string;
    // Fix: Add optional props to satisfy parent components that may pass them.
    onPromptUsed?: () => void;
    onNavigateToFeature?: (feature: Feature) => void;
}

const CHAT_HISTORY_KEY = 'snakeEngineSmartChatHistory';

const SmartChatView: React.FC<SmartChatViewProps> = ({ initialPrompt }) => {
    const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [useSearch, setUseSearch] = React.useState(false);
    const [useMaps, setUseMaps] = React.useState(false);
    const chatRef = React.useRef<Chat | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const audioContextRef = React.useRef<AudioContext | null>(null);
    
    const [attachment, setAttachment] = React.useState<File | null>(null);
    const [attachmentPreview, setAttachmentPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
            if (savedHistory) setMessages(JSON.parse(savedHistory));
            else setMessages([{ id: 'init', role: 'model', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]);
        } catch (error) {
             console.error("Could not load chat history.", error);
             setMessages([{ id: 'init', role: 'model', text: 'Hello! I am SnakeEngine AI. How can I help you today?' }]);
        }
        chatRef.current = startChat();
    }, []);

    React.useEffect(() => {
        try {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
        } catch (error) {
            console.error("Could not save chat history.", error);
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
     const handlePlayAudio = React.useCallback(async (text: string) => {
        try {
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            const base64Audio = await textToSpeech(text);
            const audioBytes = decodeBase64(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
            
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();

        } catch (error) {
            console.error("Error playing TTS audio:", error);
            alert("Sorry, I couldn't play the audio for that message.");
        }
    }, []);

    const handleFileSelect = (file: File) => {
        if (file.type.startsWith('image/')) {
            setAttachment(file);
            setAttachmentPreview(URL.createObjectURL(file));
        } else {
            alert("Only image files can be attached in this chat.");
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        setAttachmentPreview(null);
    };

    const handleSend = React.useCallback(async (prompt?: string) => {
        const currentInput = prompt || input;
        if ((!currentInput.trim() && !attachment) || isLoading) return;

        const userMessage: ChatMessageType = { 
            id: Date.now().toString(), 
            role: 'user', 
            text: currentInput,
            image: attachmentPreview || undefined
        };
        setMessages(prev => [...prev, userMessage]);
        
        const attachedFile = attachment;
        setInput('');
        setAttachment(null);
        setAttachmentPreview(null);
        setIsLoading(true);

        try {
            let responseText = '';
            let sources: GroundingSource[] = [];
            
            if (useSearch || useMaps) {
                let location: { latitude: number, longitude: number } | undefined;
                if (useMaps) {
                    try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }));
                        location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                    } catch (err) { console.error("Geolocation error:", err); }
                }
                const response = await generateTextWithGrounding(currentInput, useMaps ? 'googleMaps' : 'googleSearch', location);
                responseText = response.text;
                const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if(groundingChunks) {
                    sources = groundingChunks.map((chunk: any) => ({
                        uri: chunk.web?.uri || chunk.maps?.uri || '',
                        title: chunk.web?.title || chunk.maps?.title || '',
                    })).filter((source: GroundingSource) => source.uri);
                }
            } else {
                if (!chatRef.current) chatRef.current = startChat();
                let imagePayload;
                if (attachedFile) {
                    const base64 = await fileToBase64(attachedFile);
                    imagePayload = { base64, mimeType: attachedFile.type };
                }
                const result = await sendMessage(chatRef.current, currentInput, imagePayload);
                responseText = result.text;
            }

            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText, sources }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: `Sorry, I encountered an error: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, useSearch, useMaps, attachment, attachmentPreview]);

    const initialPromptSent = React.useRef(false);
    React.useEffect(() => {
        if (initialPrompt && !initialPromptSent.current) {
            setTimeout(() => {
                handleSend(initialPrompt);
                initialPromptSent.current = true;
            }, 100);
        }
    }, [initialPrompt, handleSend]);

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg">
            <div className="flex-1 p-6 overflow-y-auto">
                {messages.map(msg => <ChatMessage key={msg.id} message={msg} onPlayAudio={handlePlayAudio} />)}
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
            <div className="p-4 sm:p-6 bg-slate-100/80 dark:bg-slate-800/80 rounded-b-2xl">
                {attachmentPreview && (
                    <div className="relative w-24 h-24 mb-2 rounded-lg overflow-hidden shadow-md">
                        <img src={attachmentPreview} alt="Attachment preview" className="w-full h-full object-cover"/>
                        <button onClick={removeAttachment} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black/80">
                            <Icon name="close" className="w-3 h-3"/>
                        </button>
                    </div>
                )}
                 <ModernChatInput
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    isLoading={isLoading}
                    showAttachButton={true}
                    onFileSelect={handleFileSelect}
                    showGroundingOptions={true}
                    useSearch={useSearch}
                    onSearchChange={(checked) => { setUseSearch(checked); if(checked) setUseMaps(false); }}
                    useMaps={useMaps}
                    onMapsChange={(checked) => { setUseMaps(checked); if(checked) setUseSearch(false); }}
                />
            </div>
        </div>
    );
};

export default SmartChatView;