
import React from 'react';
import { EmailIcon } from '../components/Icons';

export const EmailAssistantView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Email Assistant</h1>
                <p className="text-text-secondary mt-1">Draft replies, summarize threads, and write better emails.</p>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[300px]">
                <div className="text-center text-text-secondary">
                    <EmailIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Email Assistant feature coming soon.</p>
                </div>
            </div>
        </div>
    );
};
