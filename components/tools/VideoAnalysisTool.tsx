import React, { useState } from 'react';
import { analyzeVideo } from '../../services/geminiService';
import { LogoIcon } from '../../constants';

// --- HELPER ICONS ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return { data: await base64EncodedDataPromise, mimeType: file.type, preview: URL.createObjectURL(file) };
};

interface VideoAnalysisToolProps { onBack: () => void; }

const VideoAnalysisTool: React.FC<VideoAnalysisToolProps> = ({ onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [video, setVideo] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (files: FileList | null) => {
        if (files && files[0]) {
            setError(null);
            setResponse(null);
            const videoData = await fileToGenerativePart(files[0]);
            setVideo(videoData);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFileChange(e.dataTransfer.files); };

    const handleAnalyze = async () => {
        if (!prompt.trim() || !video || isLoading) return;

        setIsLoading(true);
        setResponse(null);
        setError(null);
        const result = await analyzeVideo(prompt, video);
        if (result.startsWith("Sorry")) {
            setError(result);
        } else {
            setResponse(result);
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="flex-shrink-0 mb-8"><button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 font-medium"><BackIcon /><span className="ml-2">Back to Smart Studio</span></button></div>
            <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col">
                 <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Video Analysis</h1>
                    <p className="text-gray-500 mt-2">Ask questions about a video and get intelligent answers.</p>
                </div>
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
                        <label 
                            htmlFor="file-upload" 
                            className="flex flex-col items-center justify-center w-full flex-grow border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 mb-4"
                            onDragOver={handleDragOver} onDrop={handleDrop}>
                            {video ? (
                                <video src={video.preview} controls className="h-full w-full object-contain rounded-lg p-2" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    <p className="mt-2">Drag & drop or click to upload video</p>
                                </div>
                            )}
                        </label>
                        <input id="file-upload" type="file" className="hidden" accept="video/*" onChange={(e) => handleFileChange(e.target.files)} />
                        <div className="flex-shrink-0">
                            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., What is being discussed in this video?" className="w-full p-3 h-24 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition" disabled={isLoading}/>
                            <button onClick={handleAnalyze} disabled={isLoading || !prompt.trim() || !video} className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                                {isLoading ? <Spinner /> : 'Analyze Video'}
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-semibold text-lg text-gray-800 mb-4">Analysis Result</h3>
                        <div className="bg-gray-50 rounded-lg p-4 h-full min-h-[300px] overflow-y-auto">
                            {isLoading && <div className="flex justify-center items-center h-full"><div className="text-center text-gray-500"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div><p className="mt-3">Analyzing...</p></div></div>}
                            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>}
                            {response && <div className="flex items-start gap-3"><div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center"><LogoIcon className="h-5 w-5 text-white"/></div><p className="text-gray-700 whitespace-pre-wrap">{response}</p></div>}
                            {!isLoading && !response && !error && <div className="text-center text-gray-400 flex items-center justify-center h-full"><p>The AI's analysis will appear here.</p></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoAnalysisTool;
