import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageIcon } from '../components/Icons';
import { useUsageTracker } from '../hooks/useUsageTracker';

const TOTAL_FREE_IMAGES = 50;

export const ImageGenView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('photorealistic');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { count, increment, hasUses } = useUsageTracker('imageGen', TOTAL_FREE_IMAGES);

    const handleGenerate = async () => {
        if (!hasUses()) {
            setError('You have used all your free image generations.');
            return;
        }
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const fullPrompt = `${prompt}, ${style} style`;
            const imageUrl = await generateImage(fullPrompt);
            setGeneratedImage(imageUrl);
            increment();
        } catch (err) {
            console.error("Image generation failed:", err);
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary gradient-text">AI Image Generation</h1>
                <p className="text-text-secondary mt-1">Create stunning visuals with the power of AI.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                <div className="lg:w-1/3 space-y-6">
                    <div className="p-6 rounded-2xl glass-pane">
                        <label htmlFor="prompt" className="block text-sm font-medium text-text-primary mb-2">
                            Enter your prompt
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A futuristic city on Mars with flying cars"
                            className="w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition text-text-primary placeholder:text-slate-400"
                            rows={4}
                        />
                    </div>

                    <div className="p-6 rounded-2xl glass-pane">
                        <label htmlFor="style" className="block text-sm font-medium text-text-primary mb-2">
                            Select a style
                        </label>
                        <select
                            id="style"
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition appearance-none text-text-primary"
                        >
                            <option>Photorealistic</option>
                            <option>Anime</option>
                            <option>Digital Art</option>
                            <option>Cyberpunk</option>
                            <option>Fantasy</option>
                            <option>Watercolor</option>
                        </select>
                    </div>

                    <div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !hasUses()}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-purple"
                        >
                            {isLoading ? 'Generating...' : 'Generate Image'}
                        </button>
                        <div className="text-center mt-2 text-sm text-text-secondary">
                             {hasUses() ? (
                                <p>{TOTAL_FREE_IMAGES - count} / {TOTAL_FREE_IMAGES} free generations remaining.</p>
                             ) : (
                                <p>No free generations left. <a href="#" className="text-brand-purple font-semibold hover:underline">Upgrade to Pro</a>.</p>
                             )}
                        </div>
                    </div>

                    {error && <p className="text-sm text-brand-red mt-2">{error}</p>}
                </div>

                <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[300px]">
                    {isLoading && (
                        <div className="text-center">
                            <ImageIcon className="w-16 h-16 text-brand-purple animate-pulse mx-auto" />
                            <p className="mt-4 text-text-secondary">Your vision is materializing...</p>
                        </div>
                    )}
                    {!isLoading && generatedImage && (
                        <img src={generatedImage} alt="Generated by AI" className="rounded-lg shadow-2xl max-h-full max-w-full object-contain" />
                    )}
                    {!isLoading && !generatedImage && (
                        <div className="text-center text-text-secondary">
                            <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                            <p>Your generated image will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};