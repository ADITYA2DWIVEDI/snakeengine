import React, { useState, useEffect } from 'react';
import { Page, Feature } from '../../../types';
import { Icon } from '../../icons';

// Import all platform feature views
import SmartChatView from './platforms/SmartChatView';
import LiveVoiceView from './platforms/LiveVoiceView';
import ImageGenerationView from './platforms/ImageGenerationView';
import ImageEditingView from './platforms/ImageEditingView';
import VideoGenerationView from './platforms/VideoGenerationView';
import FileAnalysisView from './platforms/FileAnalysisView';
import ThinkingModeView from './platforms/ThinkingModeView';
import AudioTranscriptionView from './platforms/AudioTranscriptionView';

interface AIPlatformsViewProps {
    initialFeature?: Feature;
    initialPrompt?: string;
    onPromptUsed: () => void;
}

const features: { name: Feature, icon: Feature }[] = [
    { name: Feature.SMART_CHAT, icon: Feature.SMART_CHAT },
    { name: Feature.LIVE_VOICE, icon: Feature.LIVE_VOICE },
    { name: Feature.AUDIO_TRANSCRIPTION, icon: Feature.AUDIO_TRANSCRIPTION },
    { name: Feature.IMAGE_GENERATION, icon: Feature.IMAGE_GENERATION },
    { name: Feature.IMAGE_EDITING, icon: Feature.IMAGE_EDITING },
    { name: Feature.VIDEO_GENERATION, icon: Feature.VIDEO_GENERATION },
    { name: Feature.FILE_ANALYSIS, icon: Feature.FILE_ANALYSIS },
    { name: Feature.THINKING_MODE, icon: Feature.THINKING_MODE },
];

const AIPlatformsView: React.FC<AIPlatformsViewProps> = ({ initialFeature, initialPrompt, onPromptUsed }) => {
    const [activeFeature, setActiveFeature] = useState<Feature>(initialFeature || Feature.SMART_CHAT);

    useEffect(() => {
        if (initialFeature) {
            setActiveFeature(initialFeature);
        }
    }, [initialFeature]);

    const renderActiveFeature = () => {
        switch (activeFeature) {
            case Feature.SMART_CHAT:
                return <SmartChatView 
                            initialPrompt={initialPrompt} 
                            onPromptUsed={onPromptUsed} 
                            onNavigateToFeature={setActiveFeature}
                        />;
            case Feature.LIVE_VOICE:
                return <LiveVoiceView />;
            case Feature.AUDIO_TRANSCRIPTION:
                return <AudioTranscriptionView />;
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
            default:
                 return <SmartChatView 
                            initialPrompt={initialPrompt} 
                            onPromptUsed={onPromptUsed} 
                            onNavigateToFeature={setActiveFeature}
                        />;
        }
    };
    
    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64 lg:w-56 flex-shrink-0">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 p-2">Platforms</h2>
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

export default AIPlatformsView;