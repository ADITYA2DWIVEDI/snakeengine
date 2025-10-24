import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import { Feature } from '../../types';

const StoryboardCreatorView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe the scene for the storyboard.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        const fullPrompt = `Create a 4-panel storyboard for the following scene: "${prompt}". The style should be a simple black and white line drawing. Clearly separate the panels.`;

        try {
            const base64Image = await generateImage(fullPrompt, '16:9');
            setGeneratedImage(`data:image/png;base64,${base64Image}`);
        } catch (e: any) {
            console.error("Storyboard generation error:", e);
            setError(`Failed to generate storyboard: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6">
            <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-6 rounded-xl">
                <label htmlFor="prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Scene Description</label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A detective finds a mysterious clue in a dark alley, looks around suspiciously, then runs off into the night."
                    className="w-full h-24 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-none"
                />
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Spinner /> : <Icon name={Feature.STORYBOARD_CREATOR} className="w-5 h-5"/>}
                        {isLoading ? 'Generating...' : 'Create Storyboard'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>

            <div className="flex-1 min-h-0 mt-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex flex-col items-center justify-center p-4">
                 {isLoading ? (
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-4 text-slate-500 dark:text-slate-400">Drawing your storyboard...</p>
                    </div>
                ) : generatedImage ? (
                    <div className="text-center flex flex-col items-center">
                         <img src={generatedImage} alt="Generated storyboard" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
                         <a
                            href={generatedImage}
                            download="storyboard.png"
                            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors"
                        >
                            <Icon name="download" className="w-5 h-5"/> Download
                        </a>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <Icon name={Feature.STORYBOARD_CREATOR} className="w-16 h-16 mx-auto mb-2" />
                        <p>Your 4-panel storyboard will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryboardCreatorView;
