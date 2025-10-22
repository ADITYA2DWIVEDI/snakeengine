import React, { useState } from 'react';
import { TranslatorIcon, SendIcon } from '../components/Icons';
import { translateText } from '../services/geminiService';

const languages = [
    "English", "Spanish", "French", "German", "Japanese", "Chinese", "Korean", "Italian", "Russian", "Hindi"
];

const SwapIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 2.1l4 4-4 4" />
        <path d="M3 12.1h18" />
        <path d="M7 21.9l-4-4 4-4" />
        <path d="M21 11.9H3" />
    </svg>
);


export const TranslatorView: React.FC = () => {
    const [sourceLang, setSourceLang] = useState('English');
    const [targetLang, setTargetLang] = useState('Spanish');
    const [sourceText, setSourceText] = useState('');
    const [targetText, setTargetText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTranslate = async () => {
        if (!sourceText) return;
        setIsLoading(true);
        setTargetText('');
        try {
            const response = await translateText(sourceText, sourceLang, targetLang);
            setTargetText(response);
        } catch (error) {
            console.error(error);
            setTargetText("An error occurred during translation.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSwap = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setSourceText(targetText);
        setTargetText(sourceText);
    };

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Language Translator</h1>
                <p className="text-text-secondary mt-1">Translate text between languages instantly.</p>
            </header>

            <div className="flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-full md:w-auto flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition appearance-none text-text-primary">
                        {languages.map(lang => <option key={lang}>{lang}</option>)}
                    </select>
                    <button onClick={handleSwap} className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                        <SwapIcon className="w-6 h-6"/>
                    </button>
                    <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full md:w-auto flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition appearance-none text-text-primary">
                        {languages.map(lang => <option key={lang}>{lang}</option>)}
                    </select>
                </div>
                
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl glass-pane flex flex-col">
                        <textarea
                            value={sourceText}
                            onChange={(e) => setSourceText(e.target.value)}
                            placeholder={`Enter ${sourceLang} text here...`}
                            className="w-full flex-1 p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition resize-none text-text-primary placeholder:text-text-secondary"
                        />
                    </div>
                     <div className="p-6 rounded-2xl glass-pane bg-bg-secondary/50 flex flex-col">
                        <div className="flex-1 w-full p-3 bg-white rounded-lg border border-border-color whitespace-pre-wrap overflow-y-auto text-text-primary">
                            {isLoading ? <span className="text-slate-400">Translating...</span> : targetText || <span className="text-slate-500">Translation will appear here.</span>}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button onClick={handleTranslate} disabled={isLoading || !sourceText} className="w-full max-w-xs flex items-center justify-center gap-2 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                        {isLoading ? 'Translating...' : 'Translate'} <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};
