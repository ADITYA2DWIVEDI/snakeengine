import React, { useState } from 'react';
import { generateImage, ImageGenerationResult } from '../../services/geminiService';

const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

interface ToolProps { onBack: () => void; }

const ImageGenerationTool: React.FC<ToolProps> = ({ onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ImageGenerationResult | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setResult(null);
        const response = await generateImage(prompt, aspectRatio);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <button onClick={onBack} className="self-start mb-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Smart Studio
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Image Generation</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Create stunning visuals from a text description.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A robot holding a red skateboard."
                        className="w-full p-3 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        disabled={isLoading}
                    />
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-auto">
                            <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aspect Ratio</label>
                            <select
                                id="aspect-ratio"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full sm:w-48 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                disabled={isLoading}
                            >
                                <option>1:1</option>
                                <option>16:9</option>
                                <option>9:16</option>
                                <option>4:3</option>
                                <option>3:4</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? <Spinner /> : 'Generate'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex-grow">
                    {isLoading && (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                <p className="mt-4">Generating your image...</p>
                            </div>
                        </div>
                    )}
                    {result?.error && (
                         <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{result.error}</span>
                        </div>
                    )}
                    {result?.images && result.images.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {result.images.map((base64Image, index) => (
                                <div key={index} className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                                    <img 
                                        src={`data:image/jpeg;base64,${base64Image}`} 
                                        alt={`Generated image ${index + 1}`}
                                        className="rounded-lg w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationTool;