
import React, { useState } from 'react';
import { generateAppSpecification } from '../../services/geminiService';
import { Feature } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

interface AppSpecification {
    appName: string;
    description: string;
    features: string[];
    techStack: {
        frontend: string;
        backend: string;
        database: string;
    };
    code: {
        html: string;
        css: string;
        javascript: string;
    };
}

const AppBuilderView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AppSpecification | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe the app you want to build.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generateAppSpecification(prompt);
            const parsedResult = JSON.parse(response.text) as AppSpecification;
            setResult(parsedResult);
        } catch (e: any) {
            console.error("App Builder error:", e);
            setError(`Failed to build app spec: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const CodeBlock: React.FC<{ language: string, code: string }> = ({ language, code }) => (
        <div>
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">{language}</h4>
            <pre className="bg-slate-200 dark:bg-slate-900/70 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            {/* Left Panel: Controls */}
            <div className="w-full md:w-1/3 flex-shrink-0 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <Icon name={Feature.APP_BUILDER} className="w-6 h-6 text-purple-600 dark:text-teal-400" />
                    <h2 className="text-xl font-bold">App Builder</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Describe the application you want to build, and our AI architect will generate a complete blueprint for you.</p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A simple to-do list app with a dark mode toggle and local storage persistence."
                    className="w-full flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-none"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full mt-4 px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5"/>}
                    {isLoading ? 'Building...' : 'Build App'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>

            {/* Right Panel: Results */}
            <div className="flex-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 overflow-y-auto">
                {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 dark:border-teal-400 mx-auto"></div>
                        <p className="mt-4 text-slate-500 dark:text-slate-400">Architecting your application...</p>
                    </div>
                )}
                {!isLoading && !result && (
                     <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                        <Icon name={Feature.APP_BUILDER} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">Your app blueprint will appear here.</h3>
                        <p className="max-w-xs">Provide a description and click "Build App" to get started.</p>
                    </div>
                )}
                {result && (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold gradient-text">{result.appName}</h2>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">{result.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h3 className="font-bold mb-2">Features</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300">
                                    {result.features.map((feature, i) => <li key={i}>{feature}</li>)}
                                </ul>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h3 className="font-bold mb-2">Tech Stack</h3>
                                <div className="text-sm space-y-1">
                                    <p><strong>Frontend:</strong> {result.techStack.frontend}</p>
                                    <p><strong>Backend:</strong> {result.techStack.backend}</p>
                                    <p><strong>Database:</strong> {result.techStack.database}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                             <h3 className="text-xl font-bold mb-3">Boilerplate Code</h3>
                             <div className="space-y-4">
                                <CodeBlock language="HTML" code={result.code.html} />
                                <CodeBlock language="CSS" code={result.code.css} />
                                <CodeBlock language="JavaScript" code={result.code.javascript} />
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppBuilderView;
