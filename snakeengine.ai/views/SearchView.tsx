import React from 'react';
import { SearchIcon, MicIcon, ImageIcon } from '../components/Icons';

const SearchResult: React.FC<{ title: string; description: string; type: string; }> = ({ title, description, type }) => (
    <div className="p-4 rounded-lg glass-pane hover:border-brand-purple/50 transition-all">
        <p className="text-xs font-medium text-brand-purple uppercase">{type}</p>
        <h3 className="font-semibold text-text-primary mt-1">{title}</h3>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
    </div>
);

export const SearchView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto flex flex-col items-center">
            <header className="text-center mb-8 max-w-2xl">
                <h1 className="text-4xl font-bold text-text-primary">Smart Search</h1>
                <p className="text-text-secondary mt-2">Instantly find AI tools, templates, and conversations. Search with text, voice, or images.</p>
            </header>

            <div className="w-full max-w-2xl mb-8">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search for 'Blog Post Outline' or ask 'How do I generate a cyberpunk city?'"
                        className="w-full p-4 pl-12 pr-32 bg-white rounded-full border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition backdrop-blur-lg text-text-primary placeholder-text-secondary"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                        <button className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-brand-purple transition-colors" aria-label="Search by voice">
                            <MicIcon className="w-6 h-6" />
                        </button>
                         <button className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-brand-purple transition-colors" aria-label="Search by image">
                            <ImageIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl">
                 <h2 className="text-lg font-semibold text-text-primary mb-4">Example Results</h2>
                 <div className="space-y-4">
                    <SearchResult title="Blog Post Outline" description="A template to help structure your next blog post." type="Template" />
                    <SearchResult title="Conversation about React" description="Your chat from yesterday discussing state management hooks." type="Conversation" />
                    <SearchResult title="Image Generation Tool" description="Navigate to the tool for creating AI-powered images." type="Tool" />
                 </div>
            </div>
        </div>
    );
};