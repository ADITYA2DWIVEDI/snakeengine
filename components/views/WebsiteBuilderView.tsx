
import React, { useState } from 'react';
import { generateWebsite } from '../../services/geminiService';
import { Feature } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

interface WebsiteResult {
    siteName: string;
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
    };
    fontPairing: {
        heading: string;
        body: string;
    };
    htmlStructure: string;
}

const WebsiteBuilderView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<WebsiteResult | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe the website you want to build.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generateWebsite(prompt);
            const parsedResult = JSON.parse(response.text) as WebsiteResult;
            setResult(parsedResult);
        } catch (e: any) {
            console.error("Website Builder error:", e);
            setError(`Failed to build website: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            {/* Left Panel: Controls */}
            <div className="w-full md:w-1/3 flex-shrink-0 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <Icon name={Feature.WEBSITE_BUILDER} className="w-6 h-6 text-purple-600 dark:text-teal-400" />
                    <h2 className="text-xl font-bold">Website Builder</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Describe a website, and watch our AI designer build a live preview in seconds.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A modern, minimalist portfolio website for a photographer named Jane Doe."
                    className="w-full flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-none"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full mt-4 px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5"/>}
                    {isLoading ? 'Designing...' : 'Build Website'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>

            {/* Right Panel: Live Preview */}
            <div className="flex-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-2 flex flex-col">
                <div className="flex-shrink-0 bg-white dark:bg-slate-800 rounded-t-xl p-2 px-4 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-400 text-xs rounded-full py-1 px-3 text-center truncate">
                        {result ? `https://${result.siteName.toLowerCase().replace(/\s/g, '')}.ai` : 'preview'}
                    </div>
                </div>
                <div className="flex-1 bg-white dark:bg-slate-200 rounded-b-xl overflow-hidden">
                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 dark:border-teal-400 mx-auto"></div>
                            <p className="mt-4 text-slate-500 dark:text-slate-700">Bringing your vision to life...</p>
                        </div>
                    )}
                    {!isLoading && !result && (
                         <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                            <Icon name={Feature.WEBSITE_BUILDER} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold">Your live website preview will appear here.</h3>
                        </div>
                    )}
                    {result && (
                        <iframe
                            srcDoc={result.htmlStructure}
                            title="AI Generated Website Preview"
                            className="w-full h-full border-0"
                            sandbox="allow-scripts"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebsiteBuilderView;
