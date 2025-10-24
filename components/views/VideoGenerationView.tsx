
import React, { useState, useEffect, useRef } from 'react';
import { useVeoGenerator } from '../../hooks/useVeoGenerator';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import { fileToBase64 } from '../../utils/helpers';

const VideoGenerationView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { 
        isGenerating, 
        videoUrl, 
        error, 
        progressMessage, 
        generateVideo, 
        isKeySelected, 
        selectApiKey, 
        checkApiKey 
    } = useVeoGenerator();

    useEffect(() => {
        checkApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !imageFile) {
            alert('Please enter a prompt or upload an image.');
            return;
        }

        let imagePayload;
        if (imageFile) {
            const imageBytes = await fileToBase64(imageFile);
            imagePayload = { imageBytes, mimeType: imageFile.type };
        }

        await generateVideo({ prompt, aspectRatio, image: imagePayload });
    };

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg">
            <div className="flex-1 p-6 flex flex-col md:flex-row gap-8">
                {/* Controls */}
                <div className="w-full md:w-1/3 space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl overflow-y-auto">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Prompt (Optional if an image is provided)</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A cinematic shot of a wolf howling, or 'make this scene fly over a city' if using an image"
                            className="w-full h-24 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-none"
                        />
                    </div>
                    
                     <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Starting Image (Optional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600/50 cursor-pointer overflow-hidden"
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Icon name="upload" className="w-8 h-8 mx-auto" />
                                    <p className="text-xs mt-1 font-semibold">Upload an image to animate</p>
                                    <p className="text-xs text-slate-400">or describe a scene in the prompt</p>
                                </div>
                            )}
                        </div>
                        {imageUrl && <button onClick={handleRemoveImage} className="text-xs text-red-500 mt-1 hover:underline">Remove image</button>}
                    </div>

                    <div>
                        <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Aspect Ratio</label>
                        <select
                            id="aspectRatio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500"
                        >
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                        </select>
                    </div>
                    
                    {!isKeySelected ? (
                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
                            <p className="mb-2 font-semibold">API Key Required</p>
                            <p className="mb-2">Veo video generation requires an API key. Please select one to proceed.</p>
                            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900 dark:hover:text-yellow-100">Learn about billing</a>
                            <button onClick={selectApiKey} className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                                Select API Key
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Spinner /> : <Icon name="video" className="w-5 h-5"/>}
                            {isGenerating ? 'Generating...' : 'Generate Video'}
                        </button>
                    )}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                
                {/* Video Display */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex flex-col items-center justify-center p-4">
                    {isGenerating ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 dark:border-teal-400 mx-auto"></div>
                            <p className="mt-4 text-slate-500 dark:text-slate-400">{progressMessage || "Preparing..."}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">(Video generation can take several minutes)</p>
                        </div>
                    ) : videoUrl ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-[85%] object-contain rounded-lg shadow-lg" />
                            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                                <a 
                                    href={videoUrl} 
                                    download="snakeengine-video.mp4"
                                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Icon name="download" className="w-5 h-5"/> Download Video
                                </a>
                                <button 
                                    onClick={handleGenerate} 
                                    disabled={isGenerating}
                                    className="w-full sm:w-auto px-4 py-2 bg-slate-500 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
                                >
                                    <Icon name="brain" className="w-5 h-5"/> Regenerate
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500">
                            <Icon name="video" className="w-16 h-16 mx-auto mb-2" />
                            <p>Your generated video will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoGenerationView;
