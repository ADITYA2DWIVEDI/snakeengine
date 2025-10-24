/// <reference types="react" />
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenaiBlob } from '@google/genai';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import { encodeBase64, decodeBase64, decodeAudioData } from '../../utils/helpers';

const LiveChatView: React.FC = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcriptions, setTranscriptions] = useState<{ role: 'user' | 'model', text: string }[]>([]);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    
    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');

    const stopConversation = useCallback(() => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        setIsActive(false);
        setIsConnecting(false);
        nextStartTimeRef.current = 0;
    }, []);

    const startConversation = useCallback(async () => {
        if (isActive || isConnecting) return;
        
        setIsConnecting(true);
        setError(null);
        setTranscriptions([]);
        currentInputTranscription.current = '';
        currentOutputTranscription.current = '';

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
                        setIsConnecting(false);
                        setIsActive(true);
                        
                        // Start microphone stream
                        if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
                           inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                        }
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
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle audio playback
                        const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData && outputAudioContextRef.current) {
                            const audioContext = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                            const decoded = decodeBase64(audioData);
                            const audioBuffer = await decodeAudioData(decoded, audioContext, 24000, 1);
                            
                            const source = audioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContext.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                        }

                        // Handle transcription
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }

                        if(message.serverContent?.turnComplete){
                            const userInput = currentInputTranscription.current;
                            const modelOutput = currentOutputTranscription.current;
                            if (userInput || modelOutput) {
                                setTranscriptions(prev => [...prev, {role: 'user', text: userInput}, {role: 'model', text: modelOutput}]);
                            }
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError(`Connection error: ${e.message || 'An unknown error occurred.'}`);
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        console.debug('Live session closed.');
                        stopConversation();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are a friendly voice assistant named SnakeEngine AI.',
                },
            });

        } catch (e: any) {
            console.error("Failed to start conversation:", e);
            setError(`Failed to start: ${e.message}`);
            setIsConnecting(false);
        }
    }, [isActive, isConnecting, stopConversation]);

    useEffect(() => {
        return () => {
            stopConversation();
        }
    }, [stopConversation]);

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg">
            <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6">
                <div className="w-48 h-48 rounded-full flex items-center justify-center bg-white/50 dark:bg-slate-700/50 relative">
                    {isActive && <div className="absolute inset-0 rounded-full bg-purple-500/50 dark:bg-teal-500/50 animate-pulse"></div>}
                    <Icon name="microphone" className={`w-20 h-20 transition-colors ${isActive ? 'text-purple-500 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={startConversation}
                        disabled={isActive || isConnecting}
                        className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isConnecting ? <Spinner /> : <Icon name="microphone" className="w-5 h-5"/>}
                        {isConnecting ? 'Connecting...' : 'Start Conversation'}
                    </button>
                    <button
                        onClick={stopConversation}
                        disabled={!isActive && !isConnecting}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                       <Icon name="stop" className="w-5 h-5"/> Stop
                    </button>
                </div>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
            <div className="h-1/3 p-6 border-t border-slate-200 dark:border-slate-700 overflow-y-auto bg-white/50 dark:bg-slate-900/50 rounded-b-2xl">
                <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Transcription</h3>
                <div className="space-y-2 text-sm">
                    {transcriptions.length === 0 && <p className="text-slate-500 dark:text-slate-400">Conversation will appear here...</p>}
                    {transcriptions.map((t, i) => (
                        <div key={i} className={`p-2 rounded`}>
                           <span className={`font-bold capitalize ${t.role === 'user' ? 'text-slate-600 dark:text-slate-300' : 'text-purple-600 dark:text-teal-400'}`}>{t.role}: </span>
                           <span className="text-slate-700 dark:text-slate-200">{t.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LiveChatView;