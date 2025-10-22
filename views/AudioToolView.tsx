import React, { useState } from 'react';
import { AudioIcon, SendIcon } from '../components/Icons';
import { processAudio } from '../services/geminiService';

export const AudioToolView: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('Transcribe the following audio.');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };
    
    const handleSubmit = async () => {
        if (!uploadedFile) return;
        setIsLoading(true);
        setResult('');
        try {
            const response = await processAudio(prompt);
            setResult(response);
        } catch (error) {
            console.error(error);
            setResult("An error occurred while processing the audio.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Audio Tool</h1>
                <p className="text-text-secondary mt-1">Transcribe, summarize, and analyze audio files with AI.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                <div className="space-y-6 flex flex-col">
                    <div className="p-6 rounded-2xl glass-pane">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">1. Upload Audio File</h2>
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-color rounded-lg text-center">
                            <AudioIcon className="w-12 h-12 text-text-secondary mb-4" />
                            {uploadedFile ? (
                                <div>
                                    <p className="font-medium text-text-primary">{uploadedFile.name}</p>
                                    <button onClick={() => setUploadedFile(null)} className="text-sm text-brand-red mt-2">Remove file</button>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="audio-upload" className="cursor-pointer font-semibold text-brand-purple hover:text-brand-purple/80">
                                        <span>Choose a file</span>
                                        <input id="audio-upload" type="file" className="sr-only" onChange={handleFileChange} accept="audio/*" />
                                    </label>
                                    <p className="text-xs text-text-secondary">or drag and drop</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl glass-pane flex-1 flex flex-col">
                        <h2 className="text-lg font-semibold text-text-primary mb-4">2. Provide Instructions</h2>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="flex-1 w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                            placeholder="e.g., 'Transcribe this meeting' or 'Summarize the key points from this lecture'"
                        />
                         <button onClick={handleSubmit} disabled={!uploadedFile || isLoading} className="w-full flex items-center justify-center gap-2 mt-4 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                            {isLoading ? 'Processing...' : 'Process Audio'} <SendIcon />
                        </button>
                    </div>
                </div>
                
                <div className="p-6 rounded-2xl glass-pane bg-bg-secondary/50 flex flex-col">
                     <h2 className="text-lg font-semibold text-text-primary mb-4">Result</h2>
                     <div className="flex-1 w-full p-3 bg-white rounded-lg border border-border-color whitespace-pre-wrap overflow-y-auto text-text-secondary">
                        {isLoading ? <span className="text-slate-400">AI is analyzing the audio...</span> : result || <span className="text-slate-500">Your results will appear here.</span>}
                     </div>
                </div>
            </div>
        </div>
    );
};