import React from 'react';
import { generateWebsite } from '../../../../services/geminiService';
import { Icon } from '../../../icons';
import Spinner from '../../../common/Spinner';

interface WebsiteResult {
    siteName: string;
    htmlStructure: string;
}

const WebsiteBuilderView: React.FC = () => {
    const [prompt, setPrompt] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<WebsiteResult | null>(null);
    const [viewMode, setViewMode] = React.useState<'preview' | 'code'>('preview');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe the website you want to build.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generateWebsite(`Generate a single-file responsive HTML document for: "${prompt}"`);
            const parsedResult = JSON.parse(response.text) as WebsiteResult;
            setResult(parsedResult);
        } catch (e: any) {
            setError(`Failed to generate website: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4 mb-6">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A modern landing page for a coffee shop"
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center gap-2">
                        {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5"/>}
                        {isLoading ? 'Building...' : 'Build Website'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            </div>

            <div className="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex flex-col">
                <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex gap-1">
                        <button onClick={() => setViewMode('preview')} className={`px-3 py-1.5 text-sm rounded-md ${viewMode === 'preview' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>Preview</button>
                        <button onClick={() => setViewMode('code')} className={`px-3 py-1.5 text-sm rounded-md ${viewMode === 'code' ? 'bg-slate-200 dark:bg-slate-700' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}>Code</button>
                    </div>
                     {result && <span className="text-sm font-semibold pr-2">{result.siteName}</span>}
                </div>
                <div className="flex-1 min-h-0 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center"><Spinner /><p className="ml-2 mt-2">Building your website...</p></div>
                    ) : !result ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                            <Icon name="globe" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>Your website preview will appear here.</p>
                        </div>
                    ) : viewMode === 'preview' ? (
                        <iframe srcDoc={result.htmlStructure} title="Website Preview" className="w-full h-full border-0" sandbox="allow-scripts"/>
                    ) : (
                        <pre className="h-full w-full overflow-auto bg-slate-900 p-4 text-xs text-white"><code className="language-html">{result.htmlStructure}</code></pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebsiteBuilderView;