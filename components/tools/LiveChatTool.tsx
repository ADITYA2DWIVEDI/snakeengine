import React, { useState, useRef, useEffect } from 'react';
import { connectLiveChat } from '../../services/geminiService';
import { LiveServerMessage, LiveSession, Blob } from '@google/genai';

// --- HELPER ICONS ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v0a9 9 0 01-9 9s-9-4.03-9-9 4.03-9 9-9v0a9 9 0 019 9v0zm-9-3.75v7.5" /><path d="M10.5 12h3" /></svg>;

// --- AUDIO UTILITIES ---
function encode(bytes: Uint8Array) { let binary = ''; const len = bytes.byteLength; for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); } return btoa(binary); }
function decode(base64: string) { const binaryString = atob(base64); const len = binaryString.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); } return bytes; }
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> { const dataInt16 = new Int16Array(data.buffer); const frameCount = dataInt16.length / numChannels; const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate); for (let channel = 0; channel < numChannels; channel++) { const channelData = buffer.getChannelData(channel); for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; } } return buffer; }
function createBlob(data: Float32Array): Blob { const l = data.length; const int16 = new Int16Array(l); for (let i = 0; i < l; i++) { int16[i] = data[i] * 32768; } return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }; }

interface LiveChatToolProps { onBack: () => void; }

const LiveChatTool: React.FC<LiveChatToolProps> = ({ onBack }) => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [transcripts, setTranscripts] = useState<{ user: string, model: string }[]>([]);
    const [currentInterim, setCurrentInterim] = useState({ user: '', model: '' });

    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const startChat = async () => {
        setStatus('connecting');
        setError(null);
        setTranscripts([]);
        setCurrentInterim({ user: '', model: '' });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            sessionPromiseRef.current = connectLiveChat({
                onopen: () => {
                    setStatus('active');
                    const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    mediaStreamSourceRef.current = source;
                    const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;
                    
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromiseRef.current?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current!.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        setCurrentInterim(prev => ({ ...prev, user: prev.user + message.serverContent!.inputTranscription!.text }));
                    }
                    if (message.serverContent?.outputTranscription) {
                        setCurrentInterim(prev => ({ ...prev, model: prev.model + message.serverContent!.outputTranscription!.text }));
                    }
                    if (message.serverContent?.turnComplete) {
                        setTranscripts(prev => [...prev, { user: currentInterim.user, model: currentInterim.model }]);
                        setCurrentInterim({ user: '', model: '' });
                    }
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (base64Audio) {
                        const outputCtx = outputAudioContextRef.current!;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                        const source = outputCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputCtx.destination);
                        source.addEventListener('ended', () => { sourcesRef.current.delete(source); });
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        sourcesRef.current.add(source);
                    }
                    if (message.serverContent?.interrupted) {
                        for (const source of sourcesRef.current.values()) { source.stop(); sourcesRef.current.delete(source); }
                        nextStartTimeRef.current = 0;
                    }
                },
                onerror: (e: ErrorEvent) => {
                    console.error('Live chat error:', e);
                    setError('A connection error occurred.');
                    setStatus('error');
                    stopChat();
                },
                onclose: (e: CloseEvent) => {
                    stopChat();
                },
            });
        } catch (err) {
            console.error('Failed to start chat:', err);
            setError('Could not access microphone. Please grant permission and try again.');
            setStatus('error');
        }
    };

    const stopChat = () => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();

        sourcesRef.current.forEach(s => s.stop());
        sourcesRef.current.clear();
        
        setStatus('idle');
    };
    
    useEffect(() => stopChat, []); // Cleanup on unmount

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="flex-shrink-0 mb-4"><button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 font-medium"><BackIcon /><span className="ml-2">Back to Smart Studio</span></button></div>
            <div className="text-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Live Chat</h1>
                <p className="text-gray-500 mt-2">Speak directly with the AI in real-time.</p>
            </div>
            <div className="w-full max-w-4xl mx-auto h-[60vh] bg-white rounded-2xl shadow-lg flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                    {transcripts.map((t, i) => (<div key={i}><p><b>You:</b> {t.user}</p><p><b>AI:</b> {t.model}</p><hr className="my-2"/></div>))}
                    {currentInterim.user && <p><b>You:</b> <i>{currentInterim.user}</i></p>}
                    {currentInterim.model && <p><b>AI:</b> <i>{currentInterim.model}</i></p>}
                </div>
                <div className="p-4 border-t border-gray-200 text-center">
                    {status === 'idle' || status === 'error' ? (
                        <button onClick={startChat} className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold flex items-center justify-center mx-auto hover:opacity-90 transition-opacity">
                            <MicIcon /> <span className="ml-2">Start Chat</span>
                        </button>
                    ) : (
                        <button onClick={stopChat} className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold flex items-center justify-center mx-auto hover:opacity-90 transition-opacity">
                            <StopIcon /> <span className="ml-2">Stop Chat</span>
                        </button>
                    )}
                    <p className="text-sm text-gray-500 mt-2 h-5">
                        {status === 'connecting' && 'Connecting...'}
                        {status === 'active' && 'Connection active. Start speaking.'}
                        {status === 'error' && `Error: ${error}`}
                    </p>
                </div>
            </div>
        </div>
    );
};
export default LiveChatTool;
