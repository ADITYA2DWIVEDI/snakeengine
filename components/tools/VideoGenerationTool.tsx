import React, { useState, useEffect } from 'react';
import { generateVideo, getVideosOperation } from '../../services/geminiService';

// --- HELPER ICONS ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const POLLING_MESSAGES = [
    "Warming up the digital director's chair...",
    "Teaching pixels to dance...",
    "Composing a symphony of light and color...",
    "Rendering the final masterpiece, frame by frame...",
    "This is taking a bit longer than usual, but great art takes time!",
];

interface VideoGenerationToolProps { onBack: () => void; }

const VideoGenerationTool: React.FC<VideoGenerationToolProps> = ({ onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const [pollingMessage, setPollingMessage] = useState(POLLING_MESSAGES[0]);

    useEffect(() => {
        const checkKey = async () => {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
        };
        checkKey();
    }, []);
    
    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let messageIndex = 0;
            interval = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % POLLING_MESSAGES.length;
                setPollingMessage(POLLING_MESSAGES[messageIndex]);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setPollingMessage(POLLING_MESSAGES[0]);

        try {
            let operation = await generateVideo(prompt);
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await getVideosOperation(operation);
            }

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                // The API key is automatically appended by the browser context this runs in.
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const blob = await response.blob();
                setVideoUrl(URL.createObjectURL(blob));
            } else {
                throw new Error("Video generation completed, but no video URI was returned.");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            if(errorMessage.includes("Requested entity was not found.")){
                setError("Your API Key is invalid. Please select a valid key.");
                setApiKeySelected(false); // Reset key state
            } else {
                setError(`Video generation failed: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSelectKey = async () => {
        await (window as any).aistudio.openSelectKey();
        // Assume key selection is successful to improve UX, error handling will catch failures.
        setApiKeySelected(true);
        setError(null);
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="flex-shrink-0 mb-8"><button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 font-medium"><BackIcon /><span className="ml-2">Back to Smart Studio</span></button></div>
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Video Generation</h1>
                    <p className="text-gray-500 mt-2">Create high-quality videos from a text description.</p>
                </div>

                {!apiKeySelected || error?.includes("API Key") ? (
                    <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                        <h2 className="text-xl font-semibold text-gray-800">API Key Required</h2>
                        <p className="text-gray-600 mt-2">The Veo video generation model requires you to select your own API key. Billing is associated with your key.</p>
                        <p className="text-sm text-gray-500 mt-1">For more details, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">billing documentation</a>.</p>
                        <button onClick={handleSelectKey} className="mt-4 px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold">Select API Key</button>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>
                ) : (
                    <>
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A neon hologram of a cat driving at top speed" className="w-full p-3 h-24 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition" disabled={isLoading}/>
                            <div className="mt-4 flex justify-end">
                                <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                                    {isLoading ? <Spinner /> : 'Generate Video'}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 flex-grow">
                            {isLoading && <div className="text-center text-gray-500"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">{pollingMessage}</p></div>}
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}
                            {videoUrl && <div className="bg-white p-4 rounded-2xl shadow-lg"><video src={videoUrl} controls autoPlay className="rounded-lg w-full" /></div>}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoGenerationTool;
