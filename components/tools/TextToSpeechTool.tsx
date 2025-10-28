import React, { useState, useRef } from 'react';
import { generateSpeech } from '../../services/geminiService';

// --- HELPER ICONS ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

// --- AUDIO UTILITIES ---
function decode(base64: string) { const binaryString = atob(base64); const len = binaryString.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); } return bytes; }
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> { const dataInt16 = new Int16Array(data.buffer); const frameCount = dataInt16.length / numChannels; const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate); for (let channel = 0; channel < numChannels; channel++) { const channelData = buffer.getChannelData(channel); for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; } } return buffer; }

const TextToSpeechTool: React.FC<{ onBack: () => void; }> = ({ onBack }) => {
    const [prompt, setPrompt] = useState('Hello! I am SnakeEngine AI, an advanced language model.');
    const [voice, setVoice] = useState('Kore');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    const handleGenerateAndPlay = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setError(null);
        
        // Stop any currently playing audio
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }

        const { audio, error } = await generateSpeech(prompt, voice);

        if (error) {
            setError(error);
            setIsLoading(false);
            return;
        }

        if (audio) {
            try {
                if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const audioCtx = audioContextRef.current;
                const audioBuffer = await decodeAudioData(decode(audio), audioCtx, 24000, 1);
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                source.start(0);
                audioSourceRef.current = source;
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to play audio.");
            }
        }
        setIsLoading(false);
    };

    const voices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="flex-shrink-0 mb-8"><button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 font-medium"><BackIcon /><span className="ml-2">Back to Smart Studio</span></button></div>
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Text to Speech</h1>
                    <p className="text-gray-500 mt-2">Convert text into lifelike speech.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter text to convert to speech..." className="w-full p-3 h-32 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition" disabled={isLoading}/>
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <select value={voice} onChange={(e) => setVoice(e.target.value)} className="w-full sm:w-auto p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                            {voices.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <button onClick={handleGenerateAndPlay} disabled={isLoading || !prompt.trim()} className="w-full sm:w-auto sm:ml-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                            {isLoading ? <Spinner /> : 'Generate & Play'}
                        </button>
                    </div>
                </div>
                <div className="mt-8 flex-grow">
                     {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}
                </div>
            </div>
        </div>
    );
};

export default TextToSpeechTool;
