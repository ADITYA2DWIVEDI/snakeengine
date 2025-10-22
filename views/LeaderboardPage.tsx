import React from 'react';
import { LeaderboardIcon } from '../components/Icons';

export const LeaderboardPage: React.FC = () => {
    return (
        <div className="h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Community Leaderboard</h1>
                <p className="text-text-secondary mt-1">See the top creators and most active community members.</p>
            </header>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[300px]">
                <div className="text-center text-text-secondary">
                    <LeaderboardIcon className="w-16 h-16 mx-auto mb-4" />
                    <p>Leaderboard feature coming soon.</p>
                </div>
            </div>
        </div>
    );
};
