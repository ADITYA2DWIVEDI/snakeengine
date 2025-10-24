// Fix: Add React types reference to resolve JSX compilation errors.
/// <reference types="react" />
import React, { useState } from 'react';
import { generateLearningPlan } from '../../services/geminiService';
import { Page, Feature } from '../../types';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';

interface LearningModule {
    title: string;
    description: string;
    subTopics: string[];
}

interface LearningPlan {
    planTitle: string;
    planDescription: string;
    modules: LearningModule[];
}

const LearningPlanBuilderView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<LearningPlan | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please describe the knowledge or skill you want to build.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await generateLearningPlan(`Create a learning plan for the following topic: "${prompt}"`);
            const parsedResult = JSON.parse(response.text) as LearningPlan;
            setResult(parsedResult);
        } catch (e: any) {
            console.error("Build Everything error:", e);
            setError(`Failed to generate plan: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6">
            <div className="flex-shrink-0">
                <p className="text-slate-500 dark:text-slate-400 mb-6">Describe a skill you want to learn or a knowledge base you need, and the AI will construct a customized plan for you.</p>
            </div>

            <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center gap-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A complete guide to astrophysics for beginners"
                    className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-6 py-3 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
                >
                    {isLoading ? <Spinner /> : <Icon name="brain" className="w-5 h-5"/>}
                    {isLoading ? 'Building...' : 'Generate Plan'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

            <div className="flex-1 min-h-0 mt-6 overflow-y-auto">
                {isLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 dark:border-teal-400 mx-auto"></div>
                        <p className="mt-4 text-slate-500 dark:text-slate-400">Constructing your knowledge plan...</p>
                    </div>
                )}
                {!isLoading && !result && (
                     <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                        <Icon name={Page.BUILD_EVERYTHING} className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">Your custom plan will be built here.</h3>
                    </div>
                )}
                {result && (
                     <div className="space-y-6 animate-fade-in">
                        <div>
                            <h2 className="text-2xl font-bold gradient-text">{result.planTitle}</h2>
                            <p className="text-slate-600 dark:text-slate-300 mt-1">{result.planDescription}</p>
                        </div>
                        <div className="space-y-4">
                            {result.modules.map((module, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800/70 p-5 rounded-xl shadow-sm">
                                    <h3 className="text-lg font-bold text-purple-600 dark:text-teal-400">Module {index + 1}: {module.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">{module.description}</p>
                                    <ul className="space-y-1.5 pl-5">
                                        {module.subTopics.map((topic, i) => (
                                            <li key={i} className="flex items-start">
                                                 <Icon name="checkmark" className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                                 <span className="text-sm text-slate-700 dark:text-slate-200">{topic}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPlanBuilderView;