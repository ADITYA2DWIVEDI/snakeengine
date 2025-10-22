import React, { useState } from 'react';
import { HealthIcon, SendIcon } from '../components/Icons';
import { getHealthAdvice } from '../services/geminiService';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const HealthAdvisorView: React.FC = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!query) return;
        setIsLoading(true);
        setResult('');
        try {
            const response = await getHealthAdvice(query);
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
                <h1 className="text-3xl font-bold text-text-primary">AI Health Advisor</h1>
                <p className="text-text-secondary mt-1">Get information on fitness, nutrition, and wellness.</p>
            </header>

            <div className="p-4 mb-6 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                <strong>Disclaimer:</strong> The information provided by this tool is for general informational purposes only and is not a substitute for professional medical advice. Always consult a qualified health provider with any questions you may have regarding a medical condition.
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl glass-pane flex flex-col">
                    <label htmlFor="health-query" className="block text-lg font-semibold text-text-primary mb-4">
                        Your Question
                    </label>
                    <textarea
                        id="health-query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'What are the benefits of a Mediterranean diet?' or 'Suggest some exercises to improve posture.'"
                        className="w-full flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                        {isLoading ? 'Generating...' : 'Get Advice'} <SendIcon />
                    </button>
                </div>

                <div className="p-6 rounded-2xl glass-pane bg-bg-secondary/50 flex flex-col">
                    <div className="flex-shrink-0 flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">Generated Information</h2>
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-sm py-1 px-3 bg-slate-200 rounded-md hover:bg-slate-300 text-text-primary">Copy</button>
                    </div>
                    <div className="flex-1 w-full p-4 bg-white rounded-lg border border-border-color overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <HealthIcon className="w-12 h-12 text-brand-purple animate-pulse" />
                            </div>
                        ) : result ? (
                            <div className="prose prose-sm max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-slate-900 prose-li:text-slate-600">
                                <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
                            </div>
                        ) : (
                             <div className="flex items-center justify-center h-full text-center">
                                <div>
                                    <HealthIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                    <p>Your health and wellness information will appear here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};