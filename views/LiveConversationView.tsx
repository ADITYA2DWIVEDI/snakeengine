import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LiveSession, LiveServerMessage } from '@google/genai';
import { liveSessionManager, createBlob, decodeAudioData, decode } from '../services/geminiService';
import { MicIcon, AILogoIcon, UserIcon } from '../components/Icons';

type ConversationStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';
type TranscriptItem = { id: string, sender: 'user' | 'ai', text: string, isFinal: boolean };

const getStatusInfo = (status: ConversationStatus): { text: string, color: string } => {
    switch (status) {
        case 'connecting': return { text: 'Connecting...', color: 'text-yellow-500' };
        case 'listening': return { text: 'Listening...', color: 'text-green-500' };
        case 'speaking': return { text: 'AI is speaking...', color: 'text-blue-500' };
        case 'error': return { text: 'Connection Error', color: 'text-red-500' };
        default: return { text: 'Ready to talk', color: 'text-text-secondary' };
    }
};

export const LiveConversationView: React.FC = () => {
    const [status, setStatus] = useState<ConversationStatus>('idle');
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const handleStart = async () => {
        if (status !== 'idle' && status !== 'error') return;

        setStatus('connecting');
        setError(null);
        setTranscript([]);
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            
            const onOpen = () => {
                setStatus('listening');
                const source = audioContextRef.current!.createMediaStreamSource(stream);
                sourceNodeRef.current = source;
                const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                scriptProcessorRef.current = scriptProcessor;

                scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createBlob(inputData);
                    sessionPromiseRef.current?.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };
                source.connect(scriptProcessor);
                scriptProcessor.connect(audioContextRef.current!.destination);
            };

            const onMessage = async (message: LiveServerMessage) => {
                if (message.serverContent?.inputTranscription) {
                    const { text, isFinal } = message.serverContent.inputTranscription;
                    setTranscript(prev => {
                        const last = prev[prev.length - 1];
                        if (last && last.sender === 'user' && !last.isFinal) {
                            last.text = text;
                            last.isFinal = isFinal;
                            return [...prev];
                        }
                        return [...prev, { id: `user-${Date.now()}`, sender: 'user', text, isFinal }];
                    });
                }
                if (message.serverContent?.outputTranscription) {
                     const { text, isFinal } = message.serverContent.outputTranscription;
                     setTranscript(prev => {
                        const last = prev[prev.length - 1];
                        if (last && last.sender === 'ai' && !last.isFinal) {
                            last.text = text;
                            last.isFinal = isFinal;
                            return [...prev];
                        }
                        return [...prev, { id: `ai-${Date.now()}`, sender: 'ai', text, isFinal }];
                    });
                }
                 if (message.serverContent?.modelTurn?.parts[0]?.inlineData.data) {
                    setStatus('speaking');
                    const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                    const audioContext = outputAudioContextRef.current!;
                    nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                    
                    const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContext.destination);
                    source.addEventListener('ended', () => {
                        audioSourcesRef.current.delete(source);
                        if (audioSourcesRef.current.size === 0) {
                           setStatus('listening');
                        }
                    });
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    audioSourcesRef.current.add(source);
                 }
            };
            
            const onError = (e: ErrorEvent) => {
                console.error(e);
                setError('An error occurred with the connection.');
                setStatus('error');
                handleStop();
            };
            
            const onClose = () => {
                setStatus('idle');
                handleStop();
            };
            
            sessionPromiseRef.current = liveSessionManager.connect(onMessage, onError, onClose, onOpen);
            
        } catch (err) {
            console.error('Failed to get user media', err);
            setError('Microphone access denied. Please enable microphone permissions in your browser.');
            setStatus('error');
        }
    };
    
    const handleStop = useCallback(() => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;

        scriptProcessorRef.current?.disconnect();
        sourceNodeRef.current?.disconnect();
        
        audioContextRef.current?.close();
        outputAudioContextRef.current?.close();

        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
        
        setStatus('idle');
    }, []);

    useEffect(() => {
      // Cleanup on component unmount
      return () => {
        handleStop();
      };
    }, [handleStop]);


    const statusInfo = getStatusInfo(status);

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-hidden">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Live Conversation</h1>
                <p className={`mt-1 font-medium ${statusInfo.color}`}>{statusInfo.text}</p>
            </header>
            
            <div className="flex-1 p-4 rounded-2xl glass-pane bg-bg-secondary/50 overflow-y-auto mb-6">
                <div className="space-y-4">
                    {transcript.map(item => (
                        <div key={item.id} className={`flex items-start gap-3 ${item.sender === 'user' ? 'justify-end' : ''}`}>
                            {item.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-brand-purple flex-shrink-0"><AILogoIcon/></div>}
                            <p className={`p-3 rounded-xl max-w-lg ${item.sender === 'user' ? 'bg-brand-purple text-white' : 'bg-white text-text-primary'} ${!item.isFinal ? 'opacity-70' : ''}`}>
                                {item.text}
                            </p>
                            {item.sender === 'user' && <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white flex-shrink-0"><UserIcon/></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-shrink-0 text-center">
                 {status === 'idle' || status === 'error' ? (
                     <button onClick={handleStart} className="w-20 h-20 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center mx-auto transition-transform hover:scale-105">
                        <MicIcon className="w-8 h-8" />
                     </button>
                 ) : (
                     <button onClick={handleStop} className="w-20 h-20 bg-brand-red text-white rounded-full shadow-lg flex items-center justify-center mx-auto transition-transform hover:scale-105">
                         <span className="text-lg font-bold">Stop</span>
                     </button>
                 )}
                 {error && <p className="text-brand-red mt-4">{error}</p>}
            </div>
        </div>
    );
};
