import React from 'react';
import { generateAppSpecification } from '../../../../services/geminiService';
import { Icon } from '../../../icons';
import Spinner from '../../../common/Spinner';

interface AppSpec {
    appName: string;
    description: string;
    features: string[];
    techStack: { frontend: string; backend: string; database: string; };
    code: { html: string; css: string; javascript: string; };
}

type Tab = 'html' | 'css' | 'javascript';

const AppBuilderView: React.FC = () => {
    const [prompt, setPrompt] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<AppSpec | null>(null);
    const [activeTab, setActiveTab] = React.useState<Tab>('html');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe the app you want to build.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generateAppSpecification(`Generate an application specification for: "${prompt}"`);
            const parsedResult = JSON.parse(response.text) as AppSpec;
            setResult(parsedResult);
        } catch (e: any) {
            setError(`Failed to generate specification: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4 mb-6">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A simple to-do list app with user accounts"
                    className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button onClick={handleGenerate} disabled={isLoading} className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center gap-2">
                    {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5"/>}
                    {isLoading ? 'Building...' : 'Build App Spec'}
                </button>
            </div>
             {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg overflow-y-auto">
                    {!result ? (
                         <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                            <Icon name="grid" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Your application specification will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h2 className="text-2xl font-bold gradient-text">{result.appName}</h2>
                                <p className="text-slate-600 dark:text-slate-300 mt-1">{result.description}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Features</h3>
                                <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    {result.features.map(f => <li key={f}>{f}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h3 className="font-semibold">Tech Stack</h3>
                                <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md"><p className="text-xs">Frontend</p><p className="font-bold text-sm">{result.techStack.frontend}</p></div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md"><p className="text-xs">Backend</p><p className="font-bold text-sm">{result.techStack.backend}</p></div>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-md"><p className="text-xs">Database</p><p className="font-bold text-sm">{result.techStack.database}</p></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
                    <h2 className="font-bold text-lg mb-2">Boilerplate Code</h2>
                    <div className="flex border-b border-slate-200 dark:border-slate-700 mb-2">
                        <button onClick={() => setActiveTab('html')} className={`px-4 py-2 text-sm ${activeTab === 'html' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-slate-500'}`}>HTML</button>
                        <button onClick={() => setActiveTab('css')} className={`px-4 py-2 text-sm ${activeTab === 'css' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-slate-500'}`}>CSS</button>
                        <button onClick={() => setActiveTab('javascript')} className={`px-4 py-2 text-sm ${activeTab === 'javascript' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-slate-500'}`}>JavaScript</button>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-lg overflow-hidden relative">
                         <pre className="h-full overflow-auto p-4 text-xs text-white"><code className={`language-${activeTab}`}>{result?.code[activeTab] || `// Code for ${activeTab} will appear here...`}</code></pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppBuilderView;