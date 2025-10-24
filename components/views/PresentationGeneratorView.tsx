import React, { useState } from 'react';
import { generatePresentationOutline } from '../../services/geminiService';
import { Feature, Presentation } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

const PresentationGeneratorView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Presentation | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please provide a topic for the presentation.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generatePresentationOutline(prompt);
            const parsedResult = JSON.parse(response.text) as Presentation;
            setResult(parsedResult);
        } catch (e: any) {
            console.error("Presentation generation error:", e);
            setError(`Failed to generate presentation: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6">
            <div className="flex-shrink-0 w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., The Future of Renewable Energy"
                    className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
                >
                    {isLoading ? <Spinner /> : <Icon name={Feature.PRESENTATION_GENERATOR} className="w-5 h-5"/>}
                    {isLoading ? 'Building...' : 'Generate Outline'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

            <div className="flex-1 min-h-0 mt-6 overflow-y-auto">
                {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Spinner />
                        <p className="mt-4 text-slate-500 dark:text-slate-400">Building your presentation outline...</p>
                    </div>
                )}
                {!isLoading && !result && (
                     <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                        <Icon name={Feature.PRESENTATION_GENERATOR} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">Your presentation outline will appear here.</h3>
                    </div>
                )}
                {result && (
                     <div className="space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-3xl font-bold gradient-text text-center">{result.mainTitle}</h2>
                        </div>
                        <div className="space-y-4">
                            {result.slides.map((slide, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800/70 p-5 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold text-purple-600 dark:text-teal-400">Slide {index + 1}: {slide.title}</h3>
                                    <ul className="mt-2 space-y-1.5 pl-5 list-disc text-sm text-slate-700 dark:text-slate-200">
                                        {slide.points.map((point, i) => <li key={i}>{point}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PresentationGeneratorView;
