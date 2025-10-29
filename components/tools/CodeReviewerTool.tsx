import React, { useState } from 'react';
import { reviewCodeSnippet } from '../../services/geminiService';

const Spinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;

const CodeReviewerTool: React.FC = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ review: string | null, error: string | null }>({ review: null, error: null });

    const handleReview = async () => {
        if (!code.trim() || isLoading) return;
        setIsLoading(true);
        setResult({ review: null, error: null });
        const response = await reviewCodeSnippet(code, language);
        setResult(response);
        setIsLoading(false);
    };

    const languages = ['javascript', 'python', 'java', 'c++', 'html', 'css', 'sql', 'typescript'];

    return (
        <div className="h-full flex flex-col p-4 md:p-8 bg-transparent">
            <div className="w-full max-w-6xl mx-auto flex-grow flex flex-col">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">AI Code Reviewer</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Get expert feedback on your code snippets.</p>
                </div>

                <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Your Code</h3>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-700">
                                {languages.map(lang => <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>)}
                            </select>
                        </div>
                        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste your code snippet here..." className="w-full flex-grow p-3 bg-gray-100 dark:bg-gray-900 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 transition font-mono text-sm" disabled={isLoading}/>
                        <button onClick={handleReview} disabled={isLoading || !code.trim()} className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
                            {isLoading ? <Spinner /> : 'Review Code'}
                        </button>
                    </div>

                    {/* Output Side */}
                    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">AI Feedback</h3>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 h-full min-h-[400px] overflow-y-auto">
                           {isLoading && <div className="flex justify-center items-center h-full"><div className="text-center text-gray-500 dark:text-gray-400"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div><p className="mt-3">Reviewing code...</p></div></div>}
                           {result.error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/30 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{result.error}</span></div>}
                           {result.review && <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.review.replace(/```(\w+)?\n/g, '<pre><code class="language-$1">').replace(/```/g, '</code></pre>') }} />}
                           {!isLoading && !result.review && !result.error && <div className="text-center text-gray-400 dark:text-gray-500 flex items-center justify-center h-full"><p>The AI's feedback will appear here.</p></div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeReviewerTool;