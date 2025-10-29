import React, { useState } from 'react';
import { generateGitHubText } from '../../services/geminiService';
import { GitHubIcon } from '../../constants';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

interface ToolProps { onBack: () => void; }

const GitHubTool: React.FC<ToolProps> = ({ onBack }) => {
    const [diff, setDiff] = useState('');
    const [textType, setTextType] = useState<'Commit Message' | 'PR Description'>('Commit Message');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ text: string | null, error: string | null }>({ text: null, error: null });

    const handleGenerate = async () => {
        if (!diff.trim() || isLoading) return;
        setIsLoading(true);
        setResult({ text: null, error: null });
        const response = await generateGitHubText(diff, textType);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col">
                 <button onClick={onBack} className="self-start mb-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Plugins
                </button>
                <div className="text-center mb-8">
                    <GitHubIcon className="h-12 w-12 mx-auto text-gray-800 dark:text-white" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-2">GitHub Assistant</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Generate commit messages and PR descriptions from your code diffs.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <textarea value={diff} onChange={e => setDiff(e.target.value)} placeholder="Paste your git diff here..." className="w-full p-3 h-48 bg-gray-100 dark:bg-gray-900 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm" />
                    <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                        <select value={textType} onChange={e => setTextType(e.target.value as any)} className="w-full sm:w-auto p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-700">
                            <option>Commit Message</option>
                            <option>PR Description</option>
                        </select>
                        <button onClick={handleGenerate} disabled={isLoading || !diff.trim()} className="w-full sm:w-auto sm:ml-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90">
                            {isLoading ? <Spinner /> : `Generate ${textType}`}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex-grow">
                     {result.error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{result.error}</span></div>}
                    {result.text && (
                        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                             <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Generated {textType}</h2>
                             <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                 <pre className="whitespace-pre-wrap font-sans">{result.text}</pre>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GitHubTool;