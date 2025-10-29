import React, { useState } from 'react';
import { draftEmail } from '../../services/geminiService';
import { GmailIcon } from '../../constants';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

interface ToolProps { onBack: () => void; }

const GmailTool: React.FC<ToolProps> = ({ onBack }) => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ email: { subject: string, body: string } | null, error: string | null }>({ email: null, error: null });

    const handleGenerate = async () => {
        if (!to.trim() || !prompt.trim() || isLoading) return;
        setIsLoading(true);
        setResult({ email: null, error: null });
        const response = await draftEmail(to, subject, prompt);
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
                    <GmailIcon className="h-12 w-12 mx-auto" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mt-2">Gmail Assistant</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Draft professional emails with the power of AI.</p>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={to} onChange={e => setTo(e.target.value)} placeholder="To: aditya@example.com" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject (optional)" className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Your email prompt... e.g., 'Write a follow-up email about our last meeting.'" className="w-full p-3 mt-4 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleGenerate} disabled={isLoading || !to.trim() || !prompt.trim()} className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90">
                            {isLoading ? <Spinner /> : 'Draft Email'}
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex-grow">
                     {result.error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{result.error}</span></div>}
                    {result.email && (
                        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                             <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Generated Draft</h2>
                             <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-600 dark:text-gray-400">Subject:</h3>
                                    <p className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md mt-1 text-gray-800 dark:text-gray-200">{result.email.subject}</p>
                                </div>
                                 <div>
                                    <h3 className="font-semibold text-gray-600 dark:text-gray-400">Body:</h3>
                                    <p className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md mt-1 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{result.email.body}</p>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GmailTool;