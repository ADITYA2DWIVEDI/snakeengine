/// <reference types="react" />
import React from 'react';
import { Page } from '../../types';
import { Icon } from '../icons';

const tools = [
    {
        icon: 'brain' as const,
        name: 'Code Helper Pro',
        description: 'Get instant code suggestions, debugging help, and boilerplate generation in your favorite IDE.',
        url: 'https://github.com/features/copilot'
    },
    {
        icon: 'photo' as const,
        name: 'Artify AI',
        description: 'Generate unique art styles from your photos, transforming them into digital masterpieces.',
        url: 'https://deepart.io/'
    },
    {
        icon: 'microphone' as const,
        name: 'LangLearn AI',
        description: 'Practice new languages with an AI voice companion that offers real-time feedback and conversation practice.',
        url: 'https://www.duolingo.com/'
    },
    {
        icon: 'video' as const,
        name: 'VidScript',
        description: 'Automatically generate video scripts from a simple prompt or a long-form article.',
        url: 'https://www.synthesia.io/'
    },
    {
        icon: Page.TEMPLATES,
        name: 'MarketMail AI',
        description: 'Craft perfect marketing emails in seconds with AI-powered copywriting and personalization.',
        url: 'https://mailchimp.com/features/content-optimizer/'
    },
    {
        icon: 'search' as const,
        name: 'Research Buddy',
        description: 'Summarize long research papers, find key insights, and generate literature reviews effortlessly.',
        url: 'https://www.perplexity.ai/'
    },
];

const DiscoverView: React.FC = () => {
    
    const ToolCard: React.FC<(typeof tools)[number]> = ({ icon, name, description, url }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-purple-600 dark:text-teal-400">
                    <Icon name={icon} className="w-6 h-6"/>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{name}</h3>
            </div>
            <p className="flex-1 mt-4 text-sm text-slate-500 dark:text-slate-400">{description}</p>
             <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full text-center py-2 px-4 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
                Visit Tool <Icon name="external-link" className="w-4 h-4"/>
            </a>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.DISCOVER} className="w-8 h-8 gradient-text" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Discover New AI Tools</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl">
                We're curating a collection of the most innovative and useful AI tools from across the web. Explore our hand-picked selection to discover your next favorite app.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map(tool => <ToolCard key={tool.name} {...tool} />)}
            </div>
        </div>
    );
};

export default DiscoverView;