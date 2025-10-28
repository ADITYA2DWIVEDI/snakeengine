import React, { useState } from 'react';
import { editImage, ImageGenerationResult } from '../../services/geminiService';

interface ImageEditingToolProps {
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

const ImageEditingTool: React.FC<ImageEditingToolProps> = ({ onBack }) => {
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
        <div className="h-full flex flex-col p-4 md:p-8 bg-gray-50">
            <div className="flex-shrink-0 mb-8">
                <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 font-medium">
                    <BackIcon />
                    <span className="ml-2">Back to Smart Studio</span>
                </button>
            </div>
            
            <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Image Editing</h1>
                    <p className="text-gray-500 mt-2">Modify an image with a text description.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
                        <label 
                            htmlFor="file-upload" 
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {image ? (
                                <img src={image.preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
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
                            className="w-full mt-4 p-3 h-24 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
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
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[300px]">
                        {isLoading && (
                            <div className="text-center text-gray-500">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                                <p className="mt-4">Editing your image...</p>
                            </div>
                        )}
                        {error && (
                             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {result?.images && result.images.length > 0 && (
                            <div className="w-full">
                                <h3 className="font-semibold text-center mb-4">Edited Image</h3>
                                <img 
                                    src={`data:image/jpeg;base64,${result.images[0]}`} 
                                    alt="Edited result"
                                    className="rounded-lg w-full object-contain"
                                />
                            </div>
                        )}
                        {!isLoading && !result && !error && (
                             <div className="text-center text-gray-400">
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
