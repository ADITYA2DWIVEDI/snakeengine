import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage as ChatMessageType, GroundingSource, Feature, ApiKey, ApiProvider } from '../../types';
import { startChat, generateTextWithGrounding, textToSpeech, sendMessage, getSystemInstruction } from '../../services/geminiService';
import { Chat } from '@google/genai';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import ChatMessage from '../common/ChatMessage';
import { decodeAudioData, decodeBase64, fileToBase64 } from '../../utils/helpers';
import ModernChatInput from '../common/ModernChatInput';
import { STORAGE_KEY } from './TopModelKeysView';
import { ProviderIcon } from '../common/ProviderIcon';

interface ChatViewProps {
    onNavigateToFeature: (feature: Feature) => void;
    // Fix: Add optional props to handle initial prompts from parent components.
    initialPrompt?: string;
    onPromptUsed?: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onNavigateToFeature, initialPrompt, onPromptUsed }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useSearch, setUseSearch] = useState(false);
    const [useMaps, setUseMaps] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    
    const [availableModels, setAvailableModels] = useState<ApiKey[]>([]);
    const [selectedModel, setSelectedModel] = useState<ApiProvider>('Google');
    const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
    
    const [attachment, setAttachment] = useState<File | null>(null);
    const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);


    // Load available models from storage
    useEffect(() => {
        try {
            const storedKeys = localStorage.getItem(STORAGE_KEY);
            const parsedKeys = storedKeys ? (JSON.parse(storedKeys) as ApiKey[]) : [];

            // Ensure there's always at least a default Google model
            if (!parsedKeys.some(k => k.provider === 'Google')) {
                parsedKeys.unshift({id: 'default-google', nickname: 'Default Gemini', provider: 'Google', key: 'DEFAULT'});
            }
            setAvailableModels(parsedKeys);

            if (parsedKeys.length > 0) {
                 setSelectedModel(parsedKeys[0].provider);
            }
        } catch (error) {
            console.error("Failed to load API keys:", error);
            setAvailableModels([{id: 'default-google', nickname: 'Default Gemini', provider: 'Google', key: 'DEFAULT'}]);
        }
    }, []);
    
    // Reset chat session when model changes
    useEffect(() => {
        const baseInstruction = getSystemInstruction();
        chatRef.current = startChat(baseInstruction + ` The user has selected the ${selectedModel} model. Tailor your response style accordingly if it makes sense.`);
        setMessages([{ id: 'init-model-select', role: 'model', text: `Switched to ${selectedModel} model. How can I assist you?` }]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedModel]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
     const handlePlayAudio = useCallback(async (text: string) => {
        try {
            if (!audioContextRef.current) {
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

    const handleSend = useCallback(async (prompt?: string) => {
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
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                        });
                        location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                    } catch (err) {
                        console.error("Geolocation error:", err);
                        // continue without location
                    }
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
                if (!chatRef.current) {
                     const baseInstruction = getSystemInstruction();
                     chatRef.current = startChat(baseInstruction + ` The user has selected the ${selectedModel} model. Tailor your response style accordingly if it makes sense.`);
                }
                
                let imagePayload;
                if (attachedFile) {
                    const base64 = await fileToBase64(attachedFile);
                    imagePayload = { base64, mimeType: attachedFile.type };
                }

                const result = await sendMessage(chatRef.current, currentInput, imagePayload);
                responseText = result.text;
            }

            const modelMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, sources };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessageType = { id: (Date.now() + 1).toString(), role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, useSearch, useMaps, selectedModel, attachment, attachmentPreview]);

    // Fix: Handle the initialPrompt prop to send a message when the component is loaded with a prompt.
    const initialPromptSent = useRef(false);
    useEffect(() => {
        if (initialPrompt && !initialPromptSent.current) {
            handleSend(initialPrompt);
            if (onPromptUsed) {
                onPromptUsed();
            }
            initialPromptSent.current = true;
        }
    }, [initialPrompt, onPromptUsed, handleSend]);

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
                    showMicButton={true}
                    onMicClick={() => onNavigateToFeature(Feature.LIVE_VOICE)}
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

export default ChatView;