import React, { useState, useEffect } from 'react';
import { Feature } from '../../../types';
import { Icon } from '../../icons';

// Import creator feature views
import YouTubeView from '../YouTubeView';
import SocialMediaPlannerView from '../SocialMediaPlannerView';
import StoryboardCreatorView from './creator/StoryboardCreatorView';
import PresentationGeneratorView from './creator/PresentationGeneratorView';


interface CreatorToolsViewProps {
    initialFeature?: Feature;
}

const features: { name: Feature, icon: Feature }[] = [
    { name: Feature.YOUTUBE_STUDIO, icon: Feature.YOUTUBE_STUDIO },
    { name: Feature.SOCIAL_PLANNER, icon: Feature.SOCIAL_PLANNER },
    { name: Feature.STORYBOARD_CREATOR, icon: Feature.STORYBOARD_CREATOR },
    { name: Feature.PRESENTATION_GENERATOR, icon: Feature.PRESENTATION_GENERATOR },
];

const CreatorToolsView: React.FC<CreatorToolsViewProps> = ({ initialFeature }) => {
    const [activeFeature, setActiveFeature] = useState<Feature>(initialFeature || Feature.YOUTUBE_STUDIO);

    useEffect(() => {
        if (initialFeature) {
            setActiveFeature(initialFeature);
        }
    }, [initialFeature]);

    const renderActiveFeature = () => {
        switch (activeFeature) {
            case Feature.YOUTUBE_STUDIO:
                return <YouTubeView />;
            case Feature.SOCIAL_PLANNER:
                return <SocialMediaPlannerView />;
            case Feature.STORYBOARD_CREATOR:
                return <StoryboardCreatorView />;
            case Feature.PRESENTATION_GENERATOR:
                return <PresentationGeneratorView />;
            default:
                 return <YouTubeView />;
        }
    };
    
    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 lg:w-56 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 p-2">Creator Suite</h2>
                    <nav className="space-y-2">
                        {features.map(feature => (
                            <button 
                                key={feature.name} 
                                onClick={() => setActiveFeature(feature.name)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 text-sm font-medium ${
                                    activeFeature === feature.name
                                    ? 'bg-gradient-to-r from-purple-500 to-teal-500 text-white shadow-md'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                <Icon name={feature.icon} className="w-5 h-5 flex-shrink-0"/>
                                <span>{feature.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="flex-1 min-h-0">
                {renderActiveFeature()}
            </main>
        </div>
    );
};

export default CreatorToolsView;