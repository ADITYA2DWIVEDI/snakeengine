

import React, { useState, useEffect } from 'react';
import { Page, Feature } from '../../types';
import { Icon } from '../icons';

// Import all feature views
import ChatView from './ChatView';
import LiveChatView from './LiveChatView';
import ImageGenerationView from './ImageGenerationView';
import ImageEditingView from './ImageEditingView';
import VideoGenerationView from './VideoGenerationView';
import FileAnalysisView from './FileAnalysisView';
import ThinkingModeView from './ThinkingModeView';
import AppBuilderView from './AppBuilderView';
import WebsiteBuilderView from './WebsiteBuilderView';
import GameAssetGeneratorView from './GameAssetGeneratorView';
import StoryboardCreatorView from './StoryboardCreatorView';
import PresentationGeneratorView from './PresentationGeneratorView';
import LearningPlanBuilderView from './LearningPlanBuilderView';
import YouTubeView from './YouTubeView';
import SocialMediaPlannerView from './SocialMediaPlannerView';


interface BuildEverythingViewProps {
    initialFeature?: Feature;
}

const AIMusicGeneratorView: React.FC = () => (
    <div className="h-full flex flex-col items-center justify-center text-center bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 animate-fade-in">
        <Icon name={Feature.AI_MUSIC_GENERATOR} className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold">AI Music Generator</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md my-2">This feature is coming soon! Get ready to generate unique, royalty-free music from text prompts.</p>
    </div>
);

const CodeConverterView: React.FC = () => (
    <div className="h-full flex flex-col items-center justify-center text-center bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 animate-fade-in">
        <Icon name={Feature.CODE_CONVERTER} className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-semibold">Code Converter</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md my-2">Coming soon! Instantly convert code snippets between popular programming languages like Python, JavaScript, Java, and more.</p>
    </div>
);


const featureCategories: {
    category: string;
    features: { name: Feature, icon: Feature | 'youtube' | Page }[];
}[] = [
    {
        category: "Text & Voice",
        features: [
            { name: Feature.SMART_CHAT, icon: Feature.SMART_CHAT },
            { name: Feature.LIVE_VOICE, icon: Feature.LIVE_VOICE },
            { name: Feature.THINKING_MODE, icon: Feature.THINKING_MODE },
        ]
    },
    {
        category: "Creative Suite",
        features: [
            { name: Feature.IMAGE_GENERATION, icon: Feature.IMAGE_GENERATION },
            { name: Feature.IMAGE_EDITING, icon: Feature.IMAGE_EDITING },
            { name: Feature.VIDEO_GENERATION, icon: Feature.VIDEO_GENERATION },
            { name: Feature.GAME_ASSET_GENERATOR, icon: Feature.GAME_ASSET_GENERATOR },
            { name: Feature.STORYBOARD_CREATOR, icon: Feature.STORYBOARD_CREATOR },
            { name: Feature.YOUTUBE_STUDIO, icon: 'youtube' },
            { name: Feature.AI_MUSIC_GENERATOR, icon: Feature.AI_MUSIC_GENERATOR },
        ]
    },
    {
        category: "Productivity & Builders",
        features: [
            { name: Feature.FILE_ANALYSIS, icon: Feature.FILE_ANALYSIS },
            { name: Feature.SOCIAL_PLANNER, icon: Feature.SOCIAL_PLANNER },
            { name: Feature.PRESENTATION_GENERATOR, icon: Feature.PRESENTATION_GENERATOR },
            { name: Feature.APP_BUILDER, icon: Feature.APP_BUILDER },
            { name: Feature.WEBSITE_BUILDER, icon: Feature.WEBSITE_BUILDER },
            { name: Feature.LEARNING_PLAN_BUILDER, icon: Feature.LEARNING_PLAN_BUILDER },
            { name: Feature.CODE_CONVERTER, icon: Feature.CODE_CONVERTER },
        ]
    }
];

const BuildEverythingView: React.FC<BuildEverythingViewProps> = ({ initialFeature }) => {
    const [activeFeature, setActiveFeature] = useState<Feature>(initialFeature || Feature.SMART_CHAT);

    useEffect(() => {
        if (initialFeature) {
            setActiveFeature(initialFeature);
        }
    }, [initialFeature]);

    const renderActiveFeature = () => {
        switch (activeFeature) {
            case Feature.SMART_CHAT:
                return <ChatView onNavigateToFeature={setActiveFeature} />;
            case Feature.LIVE_VOICE:
                return <LiveChatView />;
            case Feature.IMAGE_GENERATION:
                return <ImageGenerationView />;
            case Feature.IMAGE_EDITING:
                return <ImageEditingView />;
            case Feature.VIDEO_GENERATION:
                return <VideoGenerationView />;
            case Feature.FILE_ANALYSIS:
                return <FileAnalysisView />;
            case Feature.THINKING_MODE:
                return <ThinkingModeView />;
            case Feature.APP_BUILDER:
                return <AppBuilderView />;
            case Feature.WEBSITE_BUILDER:
                return <WebsiteBuilderView />;
            case Feature.GAME_ASSET_GENERATOR:
                return <GameAssetGeneratorView />;
            case Feature.STORYBOARD_CREATOR:
                return <StoryboardCreatorView />;
            case Feature.PRESENTATION_GENERATOR:
                return <PresentationGeneratorView />;
            case Feature.LEARNING_PLAN_BUILDER:
                return <LearningPlanBuilderView />;
            case Feature.YOUTUBE_STUDIO:
                return <YouTubeView />;
            case Feature.SOCIAL_PLANNER:
                return <SocialMediaPlannerView />;
            case Feature.AI_MUSIC_GENERATOR:
                return <AIMusicGeneratorView />;
            case Feature.CODE_CONVERTER:
                return <CodeConverterView />;
            default:
                return <ChatView onNavigateToFeature={setActiveFeature} />;
        }
    };
    
    const FeatureNav = () => (
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-x-auto">
            <nav className="flex items-center md:gap-4 whitespace-nowrap">
                {featureCategories.map(({ category, features }, catIndex) => (
                    <div key={category} className={`flex items-center flex-shrink-0 ${catIndex > 0 ? 'ml-2 pl-2 md:ml-4 md:pl-4 md:border-l md:border-slate-200 md:dark:border-slate-700' : ''}`}>
                        <h3 className="hidden md:block text-xs font-semibold text-slate-400 uppercase tracking-wider pr-2">{category}</h3>
                        <div className="flex items-center gap-1">
                            {features.map(feature => (
                                <button
                                    key={feature.name}
                                    onClick={() => setActiveFeature(feature.name)}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        activeFeature === feature.name
                                        ? 'bg-purple-100 text-purple-700 dark:bg-teal-900/50 dark:text-teal-300'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                    }`}
                                    title={feature.name}
                                    aria-current={activeFeature === feature.name}
                                >
                                    <Icon name={feature.icon as any} className="w-5 h-5" />
                                    <span className="text-xs md:text-sm">{feature.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </div>
    );


    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
                 <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Build Everything</h1>
                 <p className="text-slate-500 dark:text-slate-400">Your central hub for interacting with all of SnakeEngine's AI capabilities.</p>
            </div>
            
            <div className="flex-shrink-0 mb-6">
                <FeatureNav />
            </div>

            <div className="flex-1 min-h-0 animate-fade-in">
                {renderActiveFeature()}
            </div>
        </div>
    );
};

export default BuildEverythingView;