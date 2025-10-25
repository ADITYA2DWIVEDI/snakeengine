import React, { useState, useEffect } from 'react';
import { Feature } from '../../types';
import { Icon } from '../icons';

import SmartChatView from './studio/platforms/SmartChatView';
import ImageGenerationView from './studio/platforms/ImageGenerationView';
import ImageEditingView from './studio/platforms/ImageEditingView';
import VideoGenerationView from './studio/platforms/VideoGenerationView';
import FileAnalysisView from './studio/platforms/FileAnalysisView';
import VideoAnalysisView from './studio/platforms/VideoAnalysisView';
import ThinkingModeView from './studio/platforms/ThinkingModeView';
import AudioTranscriptionView from './studio/platforms/AudioTranscriptionView';


interface SmartStudioViewProps {
    initialFeature?: Feature;
    initialPrompt?: string;
}

const features: { name: Feature, icon: Feature }[] = [
    { name: Feature.LIVE_CHAT, icon: Feature.LIVE_CHAT },
    { name: Feature.AUDIO_TRANSCRIPTION, icon: Feature.AUDIO_TRANSCRIPTION },
    { name: Feature.IMAGE_GENERATION, icon: Feature.IMAGE_GENERATION },
    { name: Feature.IMAGE_EDITING, icon: Feature.IMAGE_EDITING },
    { name: Feature.VIDEO_GENERATION, icon: Feature.VIDEO_GENERATION },
    { name: Feature.FILE_ANALYSIS, icon: Feature.FILE_ANALYSIS },
    { name: Feature.VIDEO_ANALYSIS, icon: Feature.VIDEO_ANALYSIS },
    { name: Feature.THINKING_MODE, icon: Feature.THINKING_MODE },
];

const featureComponentMap: Record<Feature, React.FC<any>> = {
    [Feature.LIVE_CHAT]: SmartChatView,
    [Feature.AUDIO_TRANSCRIPTION]: AudioTranscriptionView,
    [Feature.IMAGE_GENERATION]: ImageGenerationView,
    [Feature.IMAGE_EDITING]: ImageEditingView,
    [Feature.VIDEO_GENERATION]: VideoGenerationView,
    [Feature.FILE_ANALYSIS]: FileAnalysisView,
    [Feature.VIDEO_ANALYSIS]: VideoAnalysisView,
    [Feature.THINKING_MODE]: ThinkingModeView,
    // Add other features here as they are implemented
    [Feature.SMART_CHAT]: SmartChatView,
    [Feature.LIVE_VOICE]: SmartChatView, // Placeholder
    [Feature.YOUTUBE_STUDIO]: () => <div>YouTube Studio</div>,
    [Feature.SOCIAL_PLANNER]: () => <div>Social Planner</div>,
    [Feature.STORYBOARD_CREATOR]: () => <div>Storyboard Creator</div>,
    [Feature.PRESENTATION_GENERATOR]: () => <div>Presentation Generator</div>,
    [Feature.APP_BUILDER]: () => <div>App Builder</div>,
    [Feature.WEBSITE_BUILDER]: () => <div>Website Builder</div>,
    [Feature.EXCEL_AUTOMATION]: () => <div>Excel Automation</div>,
    [Feature.EXCEL_NUMBER_TO_WORDS]: () => <div>Number to Words</div>,
    [Feature.EXCEL_PDF_EXTRACTOR]: () => <div>PDF Extractor</div>,
    [Feature.AI_SEARCH]: () => <div>AI Search</div>,
    [Feature.PROMPT_ENGINEERING]: () => <div>Prompt Engineering</div>,
    [Feature.CODE_CONVERTER]: () => <div>Code Converter</div>,
};

const FeatureCard: React.FC<{
    feature: { name: Feature, icon: Feature },
    onSelect: () => void
}> = ({ feature, onSelect }) => (
    <button
        onClick={onSelect}
        className="text-center p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50">
            <Icon name={feature.icon} className="w-7 h-7 sm:w-9 sm:h-9 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="mt-4 font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200">{feature.name}</h3>
    </button>
);


const SmartStudioView: React.FC<SmartStudioViewProps> = ({ initialFeature, initialPrompt }) => {
    const [selectedFeature, setSelectedFeature] = useState<Feature | null>(initialFeature || null);

    useEffect(() => {
        if (initialFeature) {
            setSelectedFeature(initialFeature);
        }
    }, [initialFeature]);

    const handleSelectFeature = (feature: Feature) => {
        setSelectedFeature(feature);
    };

    const handleGoBack = () => {
        setSelectedFeature(null);
    };

    const renderFeatureMenu = () => (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                    <span className="gradient-text">Smart Studio</span>
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Choose a tool to get started</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map(feature => (
                    <FeatureCard
                        key={feature.name}
                        feature={feature}
                        onSelect={() => handleSelectFeature(feature.name)}
                    />
                ))}
            </div>
        </div>
    );

    const renderSelectedFeature = () => {
        if (!selectedFeature) return null;

        const FeatureComponent = featureComponentMap[selectedFeature];
        const featureDisplayName = selectedFeature === Feature.FILE_ANALYSIS ? "Image Analysis" : selectedFeature;

        return (
            <div className="h-full flex flex-col animate-fade-in">
                <div className="flex items-center gap-4 mb-4 flex-shrink-0">
                    <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Icon name="back-arrow" className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{featureDisplayName}</h2>
                </div>
                <div className="flex-1 min-h-0">
                    <FeatureComponent initialPrompt={initialPrompt} />
                </div>
            </div>
        );
    };

    return selectedFeature ? renderSelectedFeature() : renderFeatureMenu();
};

export default SmartStudioView;