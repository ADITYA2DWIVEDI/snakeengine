import * as React from 'react';
import { Icon } from '../icons';
import { Page, Feature } from '../../types';

interface WhatsNewViewProps {
    onClose: () => void;
}

const updates = [
    {
        icon: 'brain' as const,
        title: "Comprehensive Feature Overhaul",
        description: "We've upgraded every feature! From smarter image editing and persistent chat history to a dynamic homepage and streamlined workflows, the entire platform is now more powerful and intuitive."
    },
    {
        icon: Feature.LIVE_CHAT,
        title: "New Live Chat",
        description: "The old AI voice chat has been replaced with a brand new human-to-human live chat platform. Connect and communicate seamlessly."
    },
    {
        icon: Page.COURSES,
        title: "All New Courses Section",
        description: "Explore a vast library of courses with a brand new interface, complete with powerful search and filtering to help you learn faster."
    },
    {
        icon: 'lock' as const,
        title: "Enhanced Security with 2FA",
        description: "Your account is now more secure. We've added a 2-factor authentication step via email for logins and password recoveries."
    },
];

const WhatsNewView: React.FC<WhatsNewViewProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center border-b border-slate-200 dark:border-slate-700">
                    <Icon name="gift" className="w-12 h-12 mx-auto mb-2 text-purple-500 dark:text-teal-400" />
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">What's New at SnakeEngine.AI</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We've been busy making things even better for you!</p>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                    {updates.map((update, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                <Icon name={update.icon as any} className="w-5 h-5 text-purple-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-700 dark:text-slate-200">{update.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{update.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-purple-600 dark:bg-teal-500 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-600 transition-colors"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsNewView;