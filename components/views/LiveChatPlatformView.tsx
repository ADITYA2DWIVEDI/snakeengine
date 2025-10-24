// Fix: Add React types reference to resolve JSX compilation errors.
/// <reference types="react" />
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenaiBlob } from '@google/genai';
import { encodeBase64, decodeBase64, decodeAudioData } from '../../utils/helpers';

type ViewState = 'home' | 'waiting' | 'in_chat';

// --- SUB-COMPONENTS ---

const VoiceCallRoom: React.FC<{ onLeave: () => void }> = ({ onLeave }) => {
    const [isConnecting, setIsConnecting] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcriptions, setTranscriptions] = useState<{ role: 'user' | 'model', text: string, id: number }[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcriptions]);


    const stopConversation = useCallback((skipLeave?: boolean) => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close()).catch(console.error);
            sessionPromiseRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close().catch(console.error);
            inputAudioContextRef.current = null;
        }
        
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
             sourcesRef.current.forEach(source => source.stop());
             sourcesRef.current.clear();
             outputAudioContextRef.current.close().catch(console.error);
             outputAudioContextRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        setIsActive(false);
        setIsConnecting(false);
        nextStartTimeRef.current = 0;

        if (!skipLeave) {
            onLeave();
        }
    }, [onLeave]);

    const startConversation = useCallback(async () => {
        setIsConnecting(true);
        setError(null);
        setTranscriptions([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: async () => {
                        console.debug('Live session opened.');
                        
                        if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
                            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        }

                        try {
                            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                            const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
                            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                            
                            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                                const l = inputData.length;
                                const int16 = new Int16Array(l);
                                for (let i = 0; i < l; i++) {
                                    int16[i] = inputData[i] * 32768;
                                }
                                const pcmBlob: GenaiBlob = {
                                    data: encodeBase64(new Uint8Array(int16.buffer)),
                                    mimeType: 'audio/pcm;rate=16000',
                                };
                                
                                sessionPromiseRef.current?.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            };
                            source.connect(scriptProcessorRef.current);
                            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                            
                            setIsConnecting(false);
                            setIsActive(true);
                            setTranscriptions([{ role: 'model', text: "Hello! I'm listening.", id: Date.now() }]);

                        } catch (e: any) {
                             setError(`Microphone access denied: ${e.message}`);
                             stopConversation(true);
                        }
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData && outputAudioContextRef.current) {
                            const audioContext = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                            const decoded = decodeBase64(audioData);
                            const audioBuffer = await decodeAudioData(decoded, audioContext, 24000, 1);
                            
                            const source = audioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContext.destination);
                            sourcesRef.current.add(source);
                            source.onended = () => {
                                sourcesRef.current.delete(source);
                            };
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                        }

                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const userInput = currentInputTranscription.current;
                            const modelOutput = currentOutputTranscription.current;
                            
                            const newMessages: { role: 'user' | 'model', text: string, id: number }[] = [];
                            if (userInput.trim()) newMessages.push({ role: 'user', text: userInput, id: Date.now() });
                            if (modelOutput.trim()) newMessages.push({ role: 'model', text: modelOutput, id: Date.now() + 1 });
                            
                            if (newMessages.length > 0) {
                                setTranscriptions(prev => [...prev, ...newMessages]);
                            }

                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError(`Connection error: An unknown error occurred.`);
                        stopConversation(true);
                    },
                    onclose: (e: CloseEvent) => {
                        console.debug('Live session closed.');
                        stopConversation(true);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are a friendly and helpful voice assistant simulating a peer in a chat room.',
                },
            });
            await sessionPromiseRef.current;
        } catch (e: any) {
            console.error("Failed to start conversation:", e);
            setError(`Failed to start: ${e.message}`);
            setIsConnecting(false);
        }
    }, [stopConversation]);

    useEffect(() => {
        startConversation();
        return () => {
            stopConversation(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in">
            <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6">
                <div className="w-48 h-48 rounded-full flex items-center justify-center bg-white/50 dark:bg-slate-700/50 relative">
                    {isActive && <div className="absolute inset-0 rounded-full bg-purple-500/30 dark:bg-teal-500/30 animate-pulse"></div>}
                    <Icon name="microphone" className={`w-20 h-20 transition-colors ${isActive ? 'text-purple-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <div className="text-center">
                    <p className="font-semibold text-lg">
                        {isConnecting ? "Connecting to peer..." : isActive ? "Connected" : "Disconnected"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isActive ? "Start speaking to your peer." : isConnecting ? "Please wait..." : "Call ended."}
                    </p>
                </div>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                 <button
                    onClick={() => stopConversation()}
                    className="mt-4 px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                >
                   <Icon name="stop" className="w-6 h-6"/> End Call
                </button>
            </div>
            <div className="h-1/3 p-6 border-t border-slate-200 dark:border-slate-700 overflow-y-auto bg-white/50 dark:bg-slate-900/50 rounded-b-2xl">
                <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Live Transcription</h3>
                <div className="space-y-3 text-sm">
                    {transcriptions.length === 0 && !isConnecting && <p className="text-slate-500 dark:text-slate-400">Conversation will appear here...</p>}
                    {transcriptions.map((t) => (
                        <div key={t.id}>
                           <span className={`font-bold capitalize ${t.role === 'user' ? 'text-slate-600 dark:text-slate-300' : 'text-purple-600 dark:text-teal-400'}`}>{t.role === 'user' ? 'You' : 'Peer'}: </span>
                           <span className="text-slate-700 dark:text-slate-200">{t.text}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};


// --- MAIN VIEW ---

const LiveChatPlatformView: React.FC = () => {
    const [view, setView] = useState<ViewState>('home');
    const [roomId, setRoomId] = useState<string>('');
    const [joinId, setJoinId] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);

    const generateRoomId = () => `snake-${Math.random().toString(36).substring(2, 6)}`;

    const handleCreateRoom = () => {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        setView('waiting');

        setTimeout(() => {
            if (document.getElementById('waiting-view')) {
                 setView('in_chat');
            }
        }, 5000);
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
        return <VoiceCallRoom onLeave={handleLeave} />;
    }

    if (view === 'waiting') {
        return (
             <div id="waiting-view" className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Voice Room is Ready</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Share this ID to start a voice chat:</p>
                    <div className="my-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg font-mono text-lg tracking-wider text-slate-700 dark:text-slate-200 flex items-center justify-between">
                        <span>{roomId}</span>
                        <button onClick={handleCopy} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Icon name={isCopied ? 'checkmark' : 'copy'} className={`w-5 h-5 ${isCopied ? 'text-green-500' : ''}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                        <Spinner />
                        <span>Simulating peer joining...</span>
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
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">P2P Live Voice Chat</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
                Create a private voice room and share the ID, or join a room to start a secure peer-to-peer voice chat, powered by AI.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
                    <Icon name="microphone-gradient" className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create a Voice Room</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Generate a unique room ID to share.</p>
                    <button onClick={handleCreateRoom} className="w-full py-3 bg-purple-600 dark:bg-teal-500 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-600 transition-colors">
                        Create New Voice Chat
                    </button>
                </div>

                 <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center">
                    <Icon name="enter" className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Join a Voice Room</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">Enter a Room ID to connect.</p>
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