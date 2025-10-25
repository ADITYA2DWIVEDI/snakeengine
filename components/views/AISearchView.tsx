import React, { useState } from 'react';
// Fix: Import `Feature` enum to correctly reference `Feature.AI_SEARCH`.
import { GroundingSource, Page, Feature } from '../../types';
import { generateTextWithGrounding } from '../../services/geminiService';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

const AISearchView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultText, setResultText] = useState<string | null>(null);
    const [sources, setSources] = useState<GroundingSource[]>([]);

    const handleSearch = async () => {
        if (!prompt.trim()) {
            setError('Please enter a search query.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultText(null);
        setSources([]);

        try {
            const response = await generateTextWithGrounding(prompt, 'googleSearch');
            setResultText(response.text);
            
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                const uniqueSources: GroundingSource[] = [];
                const seenUris = new Set<string>();
                groundingChunks.forEach((chunk: any) => {
                    const sourceUri = chunk.web?.uri || '';
                    if (sourceUri && !seenUris.has(sourceUri)) {
                        uniqueSources.push({
                            uri: sourceUri,
                            title: chunk.web?.title || new URL(sourceUri).hostname,
                        });
                        seenUris.add(sourceUri);
                    }
                });
                setSources(uniqueSources);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                {/* Fix: Corrected the icon name to use `Feature.AI_SEARCH` instead of the non-existent `Page.AI_SEARCH`. */}
                <Icon name={Feature.AI_SEARCH} className="w-8 h-8 gradient-text" />
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">AI Search</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
                Get direct answers, not just links. Powered by Gemini with Google Search grounding for up-to-date, cited information.
            </p>

            <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4 border border-slate-200 dark:border-slate-700">
                <div className="relative flex-grow">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Icon name="search" className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSearch()}
                        placeholder="Ask anything..."
                        className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-3 pl-10 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
                >
                    {isLoading ? <Spinner /> : <Icon name="send" className="w-5 h-5"/>}
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </div>
             {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

            <div className="flex-1 min-h-0 mt-6 overflow-y-auto bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6">
                 {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 dark:border-teal-400"></div>
                        <p className="mt-4 text-slate-500 dark:text-slate-400">Searching and synthesizing...</p>
                    </div>
                ) : resultText ? (
                    <div className="animate-fade-in">
                        <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: resultText.replace(/\n/g, '<br />') }} />
                        {sources.length > 0 && (
                             <div className="mt-8 border-t border-slate-300 dark:border-slate-700 pt-4">
                                <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Sources</h3>
                                <ul className="space-y-2">
                                    {sources.map(source => (
                                        <li key={source.uri}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 dark:text-teal-400 hover:underline flex items-center gap-2">
                                                <Icon name="external-link" className="w-4 h-4" />
                                                <span>{source.title}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                     <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                        {/* Fix: Corrected the icon name to use `Feature.AI_SEARCH` instead of the non-existent `Page.AI_SEARCH`. */}
                        <Icon name={Feature.AI_SEARCH} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">Your search results will appear here.</h3>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AISearchView;
