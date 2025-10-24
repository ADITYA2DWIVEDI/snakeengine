/// <reference types="react" />
import React, { useState } from 'react';
import { generateImage } from '../../services/geminiService';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import { Feature } from '../../types';

const styles = ["Pixel Art (16-bit)", "Cartoon", "Realistic", "Low Poly 3D"];

const GameAssetGeneratorView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState<string>(styles[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe the game asset.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        const fullPrompt = `${style} of ${prompt}, game asset, isolated on a clean background, high quality.`;

        try {
            const base64Image = await generateImage(fullPrompt, '1:1');
            setGeneratedImage(`data:image/png;base64,${base64Image}`);
        } catch (e: any) {
            console.error("Game Asset generation error:", e);
            setError(`Failed to generate asset: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-8 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6">
            {/* Controls */}
            <div className="w-full md:w-1/3 space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Asset Description</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., a magical sword, a health potion, a treasure chest"
                        className="w-full h-32 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-none"
                    />
                </div>
                <div>
                    <label htmlFor="style" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Art Style</label>
                    <select
                        id="style"
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500"
                    >
                        {styles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <Spinner /> : <Icon name={Feature.GAME_ASSET_GENERATOR} className="w-5 h-5"/>}
                    {isLoading ? 'Generating...' : 'Generate Asset'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            {/* Image Display */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex flex-col items-center justify-center p-4">
                {isLoading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 dark:border-teal-400 mx-auto"></div>
                        <p className="mt-4 text-slate-500 dark:text-slate-400">Generating your asset...</p>
                    </div>
                ) : generatedImage ? (
                    <div className="text-center flex flex-col items-center animate-fade-in">
                         <img src={generatedImage} alt="Generated game asset" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
                         <a
                            href={generatedImage}
                            download="game-asset.png"
                            className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors"
                        >
                            <Icon name="download" className="w-5 h-5"/> Download Asset
                        </a>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        <Icon name={Feature.GAME_ASSET_GENERATOR} className="w-16 h-16 mx-auto mb-2" />
                        <p>Your generated game asset will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameAssetGeneratorView;