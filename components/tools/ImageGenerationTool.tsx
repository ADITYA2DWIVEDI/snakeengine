import React, { useState } from 'react';
import { generateImage, ImageGenerationResult } from '../../services/geminiService';

interface ImageGenerationToolProps {
    onBack: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const ImageGenerationTool: React.FC<ImageGenerationToolProps> = ({ onBack }) => {
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
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="flex-shrink-0 mb-8">
                <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 font-medium">
                    <BackIcon />
                    <span className="ml-2">Back to Smart Studio</span>
                </button>
            </div>
            
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Image Generation</h1>
                    <p className="text-gray-500 mt-2">Create stunning visuals from a text description.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A robot holding a red skateboard."
                        className="w-full p-3 h-24 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        disabled={isLoading}
                    />
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-auto">
                            <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                            <select
                                id="aspect-ratio"
                                value={aspectRatio}
                                onChange={(e) => setAspectRatio(e.target.value)}
                                className="w-full sm:w-48 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                            <div className="text-center text-gray-500">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                <p className="mt-4">Generating your image...</p>
                            </div>
                        </div>
                    )}
                    {result?.error && (
                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{result.error}</span>
                        </div>
                    )}
                    {result?.images && result.images.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                            {result.images.map((base64Image, index) => (
                                <div key={index} className="bg-white p-4 rounded-2xl shadow-lg">
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
