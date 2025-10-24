// Fix: Add React types reference to resolve JSX compilation errors.
/// <reference types="react" />
import React, { useState, useEffect } from 'react';
import { ApiKey, ApiProvider, Page } from '../../types';
import { generatePrompt } from '../../services/geminiService';
import { Icon } from '../icons';
import Spinner from '../common/Spinner';
import { ProviderIcon } from '../common/ProviderIcon';
import { STORAGE_KEY } from './TopModelKeysView'; // Re-using the key storage location

const ParameterSlider: React.FC<{
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step: number;
}> = ({ label, value, onChange, min, max, step }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 flex justify-between">
            <span>{label}</span>
            <span>{value}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);


const PromptEngineeringView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [systemInstruction, setSystemInstruction] = useState('You are a helpful AI assistant.');
    const [temperature, setTemperature] = useState(0.7);
    const [topK, setTopK] = useState(40);
    const [topP, setTopP] = useState(0.95);
    const [model, setModel] = useState('gemini-2.5-flash');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<string | null>(null);

    const [availableModels, setAvailableModels] = useState<ApiKey[]>([]);
    
    useEffect(() => {
        try {
            const storedKeys = localStorage.getItem(STORAGE_KEY);
            const parsedKeys = storedKeys ? (JSON.parse(storedKeys) as ApiKey[]) : [];
             if (!parsedKeys.some(k => k.provider === 'Google')) {
                parsedKeys.unshift({id: 'default-google', nickname: 'Default Gemini', provider: 'Google', key: 'DEFAULT'});
            }
            setAvailableModels(parsedKeys);
        } catch (error) {
            console.error("Failed to load API keys:", error);
        }
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await generatePrompt({
                model,
                prompt,
                systemInstruction,
                generationConfig: {
                    temperature,
                    topK,
                    topP
                }
            });
            setResponse(result.text);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="h-full flex flex-col">
             <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.PROMPT_ENGINEERING} className="w-8 h-8 gradient-text" />
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Prompt Engineering</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-2xl">
                A professional workspace for crafting, testing, and fine-tuning your prompts with advanced controls.
            </p>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Column: Configuration */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col gap-6 overflow-y-auto">
                    <h2 className="text-xl font-bold">Configuration</h2>
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Model</label>
                        <select
                            id="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                            {/* You can map `availableModels` here if needed */}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="system-instruction" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">System Instruction</label>
                        <textarea
                            id="system-instruction"
                            value={systemInstruction}
                            onChange={(e) => setSystemInstruction(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                     <h3 className="text-lg font-semibold border-t border-slate-200 dark:border-slate-700 pt-4">Parameters</h3>
                    <ParameterSlider label="Temperature" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} min={0} max={1} step={0.01} />
                    <ParameterSlider label="Top-K" value={topK} onChange={(e) => setTopK(parseInt(e.target.value))} min={1} max={100} step={1} />
                    <ParameterSlider label="Top-P" value={topP} onChange={(e) => setTopP(parseFloat(e.target.value))} min={0} max={1} step={0.01} />
                </div>

                {/* Center Column: Prompt & Response */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
                    <h2 className="text-xl font-bold mb-2">Prompt</h2>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                        className="w-full flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Spinner/> : <Icon name="send" className="w-5 h-5"/>}
                            {isLoading ? 'Running...' : 'Run'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    
                    <div className="flex-1 mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col min-h-0">
                         <h2 className="text-xl font-bold mb-2 flex-shrink-0">Response</h2>
                         <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 overflow-y-auto">
                            {isLoading && <div className="flex items-center gap-2 text-slate-500"><Spinner/><span>Generating response...</span></div>}
                            {response && <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-sans">{response}</pre>}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptEngineeringView;