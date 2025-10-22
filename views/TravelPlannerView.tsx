import React, { useState } from 'react';
import { GlobeIcon, SendIcon } from '../components/Icons';
import { generateTravelItinerary } from '../services/geminiService';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const TravelPlannerView: React.FC = () => {
    const [details, setDetails] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!details) return;
        setIsLoading(true);
        setResult('');
        try {
            const response = await generateTravelItinerary(details);
            setResult(response);
        } catch (error) {
            console.error(error);
            setResult("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Travel Itinerary Planner</h1>
                <p className="text-text-secondary mt-1">Plan your next adventure down to the last detail.</p>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl glass-pane flex flex-col">
                    <label htmlFor="travel-details" className="block text-lg font-semibold text-text-primary mb-4">
                        Destination, Duration & Interests
                    </label>
                    <textarea
                        id="travel-details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="e.g., 'A 7-day trip to Tokyo for a solo traveler interested in anime, technology, and food.'"
                        className="w-full flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                        {isLoading ? 'Generating...' : 'Generate Itinerary'} <SendIcon />
                    </button>
                </div>

                <div className="p-6 rounded-2xl glass-pane bg-bg-secondary/50 flex flex-col">
                    <div className="flex-shrink-0 flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">Generated Itinerary</h2>
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-sm py-1 px-3 bg-slate-200 rounded-md hover:bg-slate-300 text-text-primary">Copy</button>
                    </div>
                    <div className="flex-1 w-full p-4 bg-white rounded-lg border border-border-color overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <GlobeIcon className="w-12 h-12 text-brand-purple animate-pulse" />
                            </div>
                        ) : result ? (
                            <div className="prose prose-sm max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-slate-900 prose-li:text-slate-600">
                                <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <GlobeIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                    <p>Your detailed travel itinerary will appear here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};