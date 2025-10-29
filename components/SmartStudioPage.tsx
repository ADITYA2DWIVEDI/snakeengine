import React, { useState } from 'react';
import { Page } from '../types';
import { GlobeIcon, MapPinIcon, VolumeUpIcon, StudyPlanIcon, CodeReviewerIcon, FileTextIcon } from '../constants';
import ImageGenerationTool from './tools/ImageGenerationTool';
import ImageEditingTool from './tools/ImageEditingTool';
import ImageAnalysisTool from './tools/ImageAnalysisTool';
import ThinkingModeTool from './tools/ThinkingModeTool';
import LiveChatTool from './tools/LiveChatTool';
import AudioTranscriptionTool from './tools/AudioTranscriptionTool';
import VideoGenerationTool from './tools/VideoGenerationTool';
import VideoAnalysisTool from './tools/VideoAnalysisTool';
import WebSearchTool from './tools/WebSearchTool';
import LocalDiscoveryTool from './tools/LocalDiscoveryTool';
import TextToSpeechTool from './tools/TextToSpeechTool';
import StudyPlanGeneratorTool from './tools/StudyPlanGeneratorTool';
import CodeReviewerTool from './tools/CodeReviewerTool';
import DocumentSummarizerTool from './tools/DocumentSummarizerTool';

const tools = [
    { id: 'live-chat', name: 'Live Chat', description: 'Speak with the AI in real-time.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, color: 'from-sky-400 to-cyan-300' },
    { id: 'audio-transcription', name: 'Audio Transcription', description: 'Convert speech from audio to text.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>, color: 'from-purple-500 to-indigo-400' },
    { id: 'image-generation', name: 'Image Generation', description: 'Create stunning visuals from text.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, color: 'from-pink-500 to-rose-400' },
    { id: 'image-editing', name: 'Image Editing', description: 'Modify images with simple prompts.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>, color: 'from-amber-500 to-orange-400' },
    { id: 'video-generation', name: 'Video Generation', description: 'Bring your ideas to life with video.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'from-red-500 to-red-400' },
    { id: 'text-to-speech', name: 'Text to Speech', description: 'Convert text into lifelike audio.', icon: <VolumeUpIcon className="h-8 w-8" />, color: 'from-blue-500 to-sky-400' },
    { id: 'image-analysis', name: 'Image Analysis', description: 'Understand the contents of any image.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-2 2m2-2l2 2m-2-2l2-2m-2 2l-2-2" /></svg>, color: 'from-teal-500 to-emerald-400' },
    { id: 'video-analysis', name: 'Video Analysis', description: 'Extract insights from video files.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>, color: 'from-fuchsia-500 to-purple-500' },
    { id: 'web-search', name: 'Web Search', description: 'Get up-to-date, grounded answers.', icon: <GlobeIcon className="h-8 w-8" />, color: 'from-cyan-500 to-blue-400' },
    { id: 'local-discovery', name: 'Local Discovery', description: 'Find places with location-aware info.', icon: <MapPinIcon className="h-8 w-8" />, color: 'from-lime-500 to-green-400' },
    { id: 'study-plan', name: 'Study Plan Generator', description: 'Create a personalized learning path.', icon: <StudyPlanIcon className="h-8 w-8" />, color: 'from-rose-500 to-fuchsia-500' },
    { id: 'code-reviewer', name: 'AI Code Reviewer', description: 'Get expert feedback on your code.', icon: <CodeReviewerIcon className="h-8 w-8" />, color: 'from-slate-600 to-gray-500' },
    { id: 'document-summarizer', name: 'Document Summarizer', description: 'Get key points from long texts.', icon: <FileTextIcon className="h-8 w-8" />, color: 'from-orange-500 to-amber-400' },
    { id: 'thinking-mode', name: 'Thinking Mode', description: 'For deep, complex conversations.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'from-slate-500 to-gray-400' },
];

const SmartStudioPage: React.FC = () => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const renderActiveTool = () => {
        const onBack = () => setActiveTool(null);
        switch(activeTool) {
            case 'live-chat': return <LiveChatTool onBack={onBack} />;
            case 'audio-transcription': return <AudioTranscriptionTool onBack={onBack} />;
            case 'image-generation': return <ImageGenerationTool onBack={onBack} />;
            case 'image-editing': return <ImageEditingTool onBack={onBack} />;
            case 'video-generation': return <VideoGenerationTool onBack={onBack} />;
            case 'text-to-speech': return <TextToSpeechTool onBack={onBack} />;
            case 'image-analysis': return <ImageAnalysisTool onBack={onBack} />;
            case 'video-analysis': return <VideoAnalysisTool onBack={onBack} />;
            case 'web-search': return <WebSearchTool onBack={onBack} />;
            case 'local-discovery': return <LocalDiscoveryTool onBack={onBack} />;
            case 'study-plan': return <StudyPlanGeneratorTool onBack={onBack} />;
            case 'code-reviewer': return <CodeReviewerTool onBack={onBack} />;
            case 'document-summarizer': return <DocumentSummarizerTool onBack={onBack} />;
            case 'thinking-mode': return <ThinkingModeTool onBack={onBack} />;
            default: return null;
        }
    };
    
    if (activeTool) {
        return renderActiveTool();
    }

    return (
        <div className="h-full p-4 md:p-8 bg-transparent overflow-y-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Smart Studio</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Choose a tool to get started</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {tools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`relative bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg p-6 flex flex-col text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border border-gray-200 dark:border-gray-700`}
                    >
                         <div className="absolute -inset-px rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-purple-500 group-hover:[box-shadow:0_0_12px_theme(colors.purple.500/50%)]"></div>
                        <div className={`relative mx-auto mb-4 text-white p-4 rounded-full bg-gradient-to-br ${tool.color} transition-all duration-300 group-hover:scale-110`}>
                            {tool.icon}
                        </div>
                        <h3 className="relative font-semibold text-gray-800 dark:text-white text-lg">{tool.name}</h3>
                        <p className="relative text-gray-500 dark:text-gray-400 text-sm mt-1">{tool.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartStudioPage;