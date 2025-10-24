/// <reference types="react" />
import React, { useState } from 'react';
import { generateWithThinking } from '../../services/geminiService';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

const ThinkingModeView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a complex prompt or question.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await generateWithThinking(prompt);
            setResponse(result.text);
        } catch (e: any) {
            console.error("Thinking mode error:", e);
            setError(`Failed to generate response: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg">
            <div className="p-6">
                 <p className="text-sm text-slate-500 dark:text-slate-400 -mt-2 mb-4">For your most complex queries. Powered by Gemini 2.5 Pro with maximum thinking budget.</p>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl">
                    <label htmlFor="prompt" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Your Complex Prompt</label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Write Python code for a web application that visualizes real-time stock market data, including backend setup and frontend components..."
                        className="w-full h-40 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-y"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5"/>}
                            {isLoading ? 'Thinking Deeply...' : 'Generate Response'}
                        </button>
                    </div>
                     {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                </div>
            </div>

            <div className="flex-1 min-h-0 p-6 pt-0">
                <div className="h-full bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-300">Generated Response</h3>
                    {isLoading ? (
                         <div className="text-center text-slate-500 dark:text-slate-400 pt-10">
                             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 dark:border-teal-400 mx-auto"></div>
                            <p className="mt-4">Engaging advanced reasoning...</p>
                        </div>
                    ) : response ? (
                        <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-sans">{response}</pre>
                    ) : (
                         <div className="text-center text-slate-500 pt-10">
                            <Icon name="logo" className="w-16 h-16 mx-auto mb-2" />
                            <p>The response will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThinkingModeView;