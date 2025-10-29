import React, { useState } from 'react';
import { generateGroundedResponse } from '../../services/geminiService';
import { LogoIcon } from '../../constants';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const WebSearchTool: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);

    const handleSearch = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setResult(null);
        const response = await generateGroundedResponse(prompt);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent">
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Web Search</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Get up-to-date, real-world information grounded in Google Search.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="e.g., Who won the most recent F1 race?" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition" disabled={isLoading} />
                        <button onClick={handleSearch} disabled={isLoading || !prompt.trim()} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                            {isLoading ? <Spinner /> : 'Search'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex-grow">
                    {isLoading && <div className="flex justify-center items-center h-full"><div className="text-center text-gray-500 dark:text-gray-400"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div><p className="mt-4">Searching the web...</p></div></div>}
                    {result && (
                        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                             <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                                   <LogoIcon className="h-5 w-5 text-white"/>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap flex-1">{result.text}</p>
                            </div>
                            {result.sources && result.sources.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-2">Sources:</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {result.sources.map((source, i) => source && (
                                            <li key={i} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer">{source.title || source.uri}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSearchTool;