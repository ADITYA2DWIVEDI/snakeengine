import React, { useState } from 'react';
import { MusicIcon, SendIcon } from '../components/Icons';
import { composeMusic } from '../services/geminiService';

export const MusicComposerView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setResult('');
        try {
            const response = await composeMusic(prompt);
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
                <h1 className="text-3xl font-bold text-text-primary">AI Music Composer</h1>
                <p className="text-text-secondary mt-1">Describe a feeling, and let the AI compose a melody for you.</p>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl glass-pane flex flex-col">
                    <label htmlFor="music-prompt" className="block text-lg font-semibold text-text-primary mb-4">
                        Describe your melody
                    </label>
                    <textarea
                        id="music-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'A happy, upbeat melody in C major for a video game level.' or 'A slow, melancholic piano tune for a rainy day.'"
                        className="w-full flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                        rows={6}
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                        {isLoading ? 'Composing...' : 'Compose Melody'} <SendIcon />
                    </button>
                </div>

                <div className="p-6 rounded-2xl glass-pane bg-bg-secondary/50 flex flex-col">
                     <div className="flex-shrink-0 flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">Generated Melody</h2>
                        <button onClick={() => navigator.clipboard.writeText(result)} className="text-sm py-1 px-3 bg-slate-200 rounded-md hover:bg-slate-300 text-text-primary">Copy</button>
                    </div>
                     <div className="flex-1 w-full p-4 bg-white rounded-lg border border-border-color whitespace-pre-wrap overflow-y-auto text-text-primary font-mono text-lg">
                        {isLoading ? <span className="text-slate-400">The AI is composing...</span> : result || <span className="text-slate-500">Your melody will appear here as musical notes.</span>}
                     </div>
                </div>
            </div>
        </div>
    );
};