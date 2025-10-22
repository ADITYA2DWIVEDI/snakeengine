import React from 'react';
import { PodcastIcon } from '../components/Icons';

export const PodcastScriptView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Podcast Script Writer</h1>
                <p className="text-text-secondary mt-1">Generate engaging scripts for your next podcast episode.</p>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[300px]">
                <div className="text-center text-text-secondary">
                    <PodcastIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Podcast Script Writer feature coming soon.</p>
                </div>
            </div>
        </div>
    );
};
