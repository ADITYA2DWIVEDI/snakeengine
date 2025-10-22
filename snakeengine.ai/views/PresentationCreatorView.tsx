
import React from 'react';
import { PresentationIcon } from '../components/Icons';

export const PresentationCreatorView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Presentation Creator</h1>
                <p className="text-text-secondary mt-1">Generate stunning presentations from a single prompt.</p>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[300px]">
                <div className="text-center text-text-secondary">
                    <PresentationIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Presentation Creator feature coming soon.</p>
                </div>
            </div>
        </div>
    );
};
