import React from 'react';
import { Feature } from '../../../../types';
import { Icon } from '../../../icons';
import { generateWithThinking } from '../../../../services/geminiService';
import Spinner from '../../../common/Spinner';

const ThinkingModeView: React.FC = () => {
    const [prompt, setPrompt] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [result, setResult] = React.useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a complex prompt or question.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generateWithThinking(prompt);
            setResult(response.text);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <Icon name={Feature.THINKING_MODE} className="w-8 h-8 gradient-text" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Thinking Mode</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
                    For your most complex challenges. This mode utilizes Gemini 2.5 Pro with an extended "thinking" budget, allowing for deeper reasoning on tasks like coding, data analysis, and strategic planning.
                </p>

                <div className="flex-1 flex flex-col min-h-0">
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="Enter your complex prompt here..."
                        className="w-full flex-1 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5" />}
                            {isLoading ? 'Thinking...' : 'Engage'}
                        </button>
                    </div>
                     {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div className="flex-1 mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col min-h-0">
                     <h2 className="text-xl font-bold mb-2 flex-shrink-0">Response</h2>
                     <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 overflow-y-auto">
                        {isLoading && <div className="flex items-center gap-2 text-slate-500"><Spinner/><span>Generating response... This may take a moment.</span></div>}
                        {result && <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-sans">{result}</pre>}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ThinkingModeView;
