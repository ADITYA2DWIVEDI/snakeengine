import React, { useState } from 'react';
import { CodeIcon, SendIcon } from '../components/Icons';
import { generateCode } from '../services/geminiService';

export const CodeAssistantView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [language, setLanguage] = useState('Python');
    const [codeResult, setCodeResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setCodeResult('');
        try {
            const fullPrompt = `Generate a ${language} code snippet for the following task: ${prompt}`;
            const result = await generateCode(fullPrompt);
            setCodeResult(result);
        } catch (error) {
            console.error(error);
            setCodeResult('Error generating code. Please check the console.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Code Assistant</h1>
                <p className="text-text-secondary mt-1">Generate, debug, and explain code in any language.</p>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6 p-6 rounded-2xl glass-pane">
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-text-primary mb-2">Language</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition appearance-none text-text-primary"
                        >
                            <option>Python</option>
                            <option>JavaScript</option>
                            <option>TypeScript</option>
                            <option>HTML/CSS</option>
                            <option>SQL</option>
                            <option>Java</option>
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label htmlFor="prompt" className="block text-sm font-medium text-text-primary mb-2">
                           Your Request
                        </label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Create a function to reverse a string' or 'Explain the difference between let and const in JavaScript'"
                            className="w-full flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                        />
                    </div>
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                        {isLoading ? 'Generating...' : 'Generate Code'} <SendIcon />
                    </button>
                </div>

                <div className="flex flex-col p-6 rounded-2xl bg-slate-800 backdrop-blur-lg border border-border-color">
                    <div className="flex-shrink-0 flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-100">Generated Code</h2>
                        <button onClick={() => navigator.clipboard.writeText(codeResult)} className="text-sm py-1 px-3 bg-slate-600 rounded-md hover:bg-slate-500 text-white">Copy</button>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-lg overflow-auto p-4 font-mono text-sm text-slate-200">
                        <pre>
                            <code className="whitespace-pre-wrap">
                                {isLoading ? <span className="text-slate-400">AI is writing your code...</span> : codeResult || <span className="text-slate-500">Your code will appear here.</span>}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};