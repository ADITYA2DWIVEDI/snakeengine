import React from 'react';
import { Page, Feature } from '../../types';
import { Icon } from '../icons';

interface TutorialViewProps {
    onTryFeature: (feature: Feature) => void;
}

const TutorialView: React.FC<TutorialViewProps> = ({ onTryFeature }) => {

    const features = [
        {
            feature: Feature.SMART_CHAT,
            // Fix: Replace non-existent Page.BUILD_EVERYTHING with Feature.SMART_CHAT for the icon.
            icon: Feature.SMART_CHAT,
            description: "Engage in intelligent text conversations. Ask questions, get information, and even tap into Google Search and Maps for real-time, grounded answers.",
        },
        {
            feature: Feature.LIVE_VOICE,
            icon: Feature.LIVE_VOICE,
            description: "Talk to the AI in real-time. Experience a natural, low-latency voice conversation with live transcription.",
        },
        {
            feature: Feature.IMAGE_GENERATION,
            icon: Feature.IMAGE_GENERATION,
            description: "Bring your ideas to life. Create stunning, high-quality images from simple text descriptions.",
        },
        {
            feature: Feature.IMAGE_EDITING,
            icon: Feature.IMAGE_EDITING,
            description: "Become a photo editor. Upload an image and use text commands to add objects, change styles, or remove elements.",
        },
        {
            feature: Feature.VIDEO_GENERATION,
            icon: Feature.VIDEO_GENERATION,
            description: "Create dynamic videos from text prompts or a starting image. Perfect for social media, presentations, and more.",
        },
        {
            feature: Feature.FILE_ANALYSIS,
            icon: Feature.FILE_ANALYSIS,
            description: "Understand your media. Upload an image or video and ask the AI to describe it, identify objects, or answer specific questions about it.",
        },
         {
            feature: Feature.THINKING_MODE,
            icon: Feature.THINKING_MODE,
            description: "Tackle complex problems. Use our most powerful model for tasks requiring deep reasoning, such as coding, data analysis, or strategic planning.",
        },
    ];

    const FeatureCard: React.FC<(typeof features)[0]> = ({ feature, icon, description }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center text-purple-600 dark:text-teal-400">
                    <Icon name={icon as any} className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{feature}</h3>
                </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 flex-1">{description}</p>
            <button 
                onClick={() => onTryFeature(feature)}
                className="mt-6 w-full py-2 px-4 bg-purple-100 dark:bg-teal-900/50 text-purple-700 dark:text-teal-300 text-sm font-semibold rounded-lg hover:bg-purple-200 dark:hover:bg-teal-800/50 transition-colors"
            >
                Try it Now
            </button>
        </div>
    );


    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <Icon name={Page.TUTORIAL} className="w-8 h-8 gradient-text" />
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                    Welcome to SnakeEngine.AI
                </h1>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-12">This tutorial will guide you through the core features of the AI Platforms page. Click "Try it Now" on any feature to jump right in!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map(f => <FeatureCard key={f.feature} {...f} />)}
            </div>
        </div>
    );
};

export default TutorialView;