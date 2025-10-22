import React, { useState } from 'react';
import { SearchIcon, GlobeIcon, MapIcon } from '../components/Icons';
import { groundedSearch } from '../services/geminiService';
import { GenerateContentResponse, GroundingChunk } from '@google/genai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SourcePill: React.FC<{ chunk: GroundingChunk }> = ({ chunk }) => {
    let source;
    let Icon;
    if (chunk.web) {
        source = chunk.web;
        Icon = GlobeIcon;
    } else if (chunk.maps) {
        source = chunk.maps;
        Icon = MapIcon;
    }

    if (!source || !source.uri) return null;

    return (
        <a 
            href={source.uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 hover:text-brand-purple transition-colors"
        >
            <Icon className="w-4 h-4" />
            <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
        </a>
    );
};


export const SearchView: React.FC = () => {
    const [query, setQuery] = useState('');
    const [useLocation, setUseLocation] = useState(false);
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<GenerateContentResponse | null>(null);

    const handleLocationToggle = () => {
        const newUseLocation = !useLocation;
        setUseLocation(newUseLocation);
        if (newUseLocation) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        setError(null);
                    },
                    () => {
                        setError("Geolocation permission denied. Please enable it in your browser settings.");
                        setUseLocation(false);
                        setLocation(null);
                    }
                );
            } else {
                setError("Geolocation is not supported by your browser.");
                setUseLocation(false);
            }
        } else {
            setLocation(null);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await groundedSearch(query, useLocation ? location : null);
            setResponse(result);
        } catch (err) {
            console.error(err);
            setError("An error occurred while searching. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const sources = response?.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto flex flex-col items-center">
            <header className="text-center mb-8 w-full max-w-3xl">
                <h1 className="text-4xl font-bold text-text-primary gradient-text">AI Grounded Search</h1>
                <p className="text-text-secondary mt-2">Get answers grounded in real-time information from Google Search & Maps.</p>
            </header>

            <div className="w-full max-w-3xl mb-8">
                <div className="relative glass-pane rounded-2xl shadow-lg p-2">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); }}}
                        placeholder="Ask anything... 'What are the best reviewed Italian restaurants near me?' or 'Who won the F1 race yesterday?'"
                        className="w-full p-4 pr-24 bg-transparent focus:outline-none transition resize-none text-text-primary placeholder:text-slate-500"
                        rows={2}
                        disabled={isLoading}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <button onClick={handleSearch} disabled={isLoading || !query.trim()} className="p-2.5 bg-gradient-to-br from-brand-purple to-brand-pink text-white rounded-full shadow-lg hover:shadow-glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-110">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                 <div className="mt-4 flex items-center justify-center gap-2">
                    <input 
                        type="checkbox" 
                        id="use-location" 
                        checked={useLocation}
                        onChange={handleLocationToggle}
                        className="h-4 w-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
                    />
                    <label htmlFor="use-location" className="text-sm text-text-secondary">
                        Include my location for better results
                    </label>
                </div>
            </div>
            
            {error && <div className="w-full max-w-3xl p-4 mb-8 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="w-full max-w-3xl flex-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 h-full">
                        <SearchIcon className="w-12 h-12 text-brand-purple animate-pulse mx-auto" />
                        <p className="mt-4 text-text-secondary">Searching the web for answers...</p>
                    </div>
                ) : response ? (
                    <div className="p-6 rounded-2xl glass-pane space-y-6 animate-fade-in">
                         <div>
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Answer</h2>
                            <div className="prose prose-sm max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-slate-900 prose-li:text-slate-600">
                                <Markdown remarkPlugins={[remarkGfm]}>{response.text}</Markdown>
                            </div>
                        </div>
                        {sources && sources.length > 0 && (
                            <div className="pt-6 border-t border-border-color">
                                <h2 className="text-lg font-semibold text-text-primary mb-4">Sources</h2>
                                <div className="flex flex-wrap gap-2">
                                    {sources.map((chunk, index) => <SourcePill key={index} chunk={chunk} />)}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 h-full">
                         <SearchIcon className="w-12 h-12 text-slate-400 mx-auto" />
                         <p className="mt-4 text-text-secondary">Your grounded search results will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};