import React from 'react';
import { GlobeIcon } from '../components/Icons';

export const TravelPlannerView: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">AI Travel Itinerary Planner</h1>
                <p className="text-text-secondary mt-1">Plan your next adventure down to the last detail.</p>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[300px]">
                <div className="text-center text-text-secondary">
                    <GlobeIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Travel Itinerary Planner feature coming soon.</p>
                </div>
            </div>
        </div>
    );
};
