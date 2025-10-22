import React from 'react';
import { HealthIcon } from '../components/Icons';

export const HealthAdvisorView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Health Advisor</h1>
                <p className="text-text-secondary mt-1">Get information on fitness, nutrition, and wellness.</p>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[300px]">
                <div className="text-center text-text-secondary">
                    <HealthIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Health Advisor feature coming soon. Always consult a medical professional for advice.</p>
                </div>
            </div>
        </div>
    );
};
