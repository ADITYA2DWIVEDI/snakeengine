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
        // Fix: Replace non-existent Page.CHAT_WITH_AI with Page.BUILD_EVERYTHING.
        icon: Page.BUILD_EVERYTHING,
        title: "Organized AI Platforms",
        description: "The main tool hub is now organized into categories: 'Text & Voice', 'Creative Suite', and 'Builders', making it easier to find the perfect tool for your task."
    },
    {
        icon: Feature.SMART_CHAT,
        title: "Persistent Chat History",
        description: "Your Smart Chat conversations are now automatically saved in your browser. You can leave and come back without losing your context."
    },
    {
        icon: Feature.IMAGE_GENERATION,
        title: "Image Style Enhancer",
        description: "Easily add artistic styles like 'Photorealistic' or 'Cyberpunk' to your image generation prompts with our new style dropdown."
    },
    {
        icon: Feature.VIDEO_GENERATION,
        title: "Seamless Video-to-YouTube Workflow",
        description: "After generating a video, instantly create a YouTube-ready title, description, and tags with the new 'Generate Metadata' button."
    },
    {
        icon: Page.COURSES,
        title: "Advanced Course Filtering",
        description: "The Courses page now includes a dedicated category sidebar, allowing you to find the exact learning path you need faster than ever."
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