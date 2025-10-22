import React, { useState } from 'react';
import { ArticleIcon, SendIcon } from '../components/Icons';
import { writeContent } from '../services/geminiService';

export const ContentWriterView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setResult('');
        try {
            const fullPrompt = `Write a long-form piece of content based on the following topic/outline: ${prompt}`;
            const response = await writeContent(fullPrompt);
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
                <h1 className="text-3xl font-bold text-text-primary">AI Content Writer</h1>
                <p className="text-text-secondary mt-1">Generate high-quality articles, essays, and reports in minutes.</p>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl glass-pane flex flex-col">
                    <label htmlFor="content-prompt" className="block text-lg font-semibold text-text-primary mb-4">
                        Topic or Outline
                    </label>
                    <textarea
                        id="content-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'An article about the benefits of remote work, including sections on productivity, work-life balance, and challenges.' or simply 'The history of the internet.'"
                        className="w-full flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                        {isLoading ? 'Writing...' : 'Write Content'} <SendIcon />
                    </button>
                </div>

                <div className="p-6 rounded-2xl glass-pane bg-bg-secondary/50 flex flex-col">
                     <div className="flex-shrink-0 flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">Generated Content</h2>
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-sm py-1 px-3 bg-slate-200 rounded-md hover:bg-slate-300 text-text-primary">Copy</button>
                    </div>
                     <div className="flex-1 w-full p-4 bg-white rounded-lg border border-border-color whitespace-pre-wrap overflow-y-auto text-text-secondary prose prose-sm max-w-none prose-p:text-slate-600">
                        {isLoading ? <span className="text-slate-400">The AI is crafting your content...</span> : result || <span className="text-slate-500">Your article will appear here.</span>}
                     </div>
                </div>
            </div>
        </div>
    );
};