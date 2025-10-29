import React, { useState } from 'react';
import { editImage, ImageGenerationResult } from '../../services/geminiService';

const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
      preview: URL.createObjectURL(file)
    };
};

interface ToolProps { onBack: () => void; }

const ImageEditingTool: React.FC<ToolProps> = ({ onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ImageGenerationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (files: FileList | null) => {
        if (files && files[0]) {
            setError(null);
            setResult(null);
            if(files[0].size > 4 * 1024 * 1024) {
                setError("Please select an image smaller than 4MB.");
                return;
            }
            const imageData = await fileToGenerativePart(files[0]);
            setImage(imageData);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files);
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || !image || isLoading) return;

        setIsLoading(true);
        setResult(null);
        setError(null);
        const response = await editImage(prompt, image);
        if (response.error) {
            setError(response.error);
        } else {
            setResult(response);
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col">
                 <button onClick={onBack} className="self-start mb-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Smart Studio
                </button>
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Image Editing</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Modify an image with a text description.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg flex flex-col border border-gray-200 dark:border-gray-700">
                        <label 
                            htmlFor="file-upload" 
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {image ? (
                                <img src={image.preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    <p className="mt-2">Drag & drop or click to upload</p>
                                    <p className="text-xs mt-1">PNG, JPG, WEBP (Max 4MB)</p>
                                </div>
                            )}
                        </label>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} />

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Add a superhero cape to the person"
                            className="w-full mt-4 p-3 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim() || !image}
                            className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? <Spinner /> : 'Generate Edit'}
                        </button>
                    </div>

                    {/* Output Side */}
                    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[300px] border border-gray-200 dark:border-gray-700">
                        {isLoading && (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                <p className="mt-4">Editing your image...</p>
                            </div>
                        )}
                        {error && (
                             <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {result?.images && result.images.length > 0 && (
                            <div className="w-full">
                                <h3 className="font-semibold text-center mb-4 text-gray-800 dark:text-white">Edited Image</h3>
                                <img 
                                    src={`data:image/jpeg;base64,${result.images[0]}`} 
                                    alt="Edited result"
                                    className="rounded-lg w-full object-contain"
                                />
                            </div>
                        )}
                        {!isLoading && !result && !error && (
                             <div className="text-center text-gray-400 dark:text-gray-500">
                                <p>Your edited image will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditingTool;