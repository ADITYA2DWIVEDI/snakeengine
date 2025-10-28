import React, { useState } from 'react';
import ImageGenerationTool from './tools/ImageGenerationTool';
import ImageEditingTool from './tools/ImageEditingTool';
import ImageAnalysisTool from './tools/ImageAnalysisTool';
import ThinkingModeTool from './tools/ThinkingModeTool';
import LiveChatTool from './tools/LiveChatTool';
import AudioTranscriptionTool from './tools/AudioTranscriptionTool';
import VideoGenerationTool from './tools/VideoGenerationTool';
import VideoAnalysisTool from './tools/VideoAnalysisTool';

const SmartStudioPage: React.FC = () => {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const tools = [
        { id: 'live-chat', name: 'Live Chat', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
        { id: 'audio-transcription', name: 'Audio Transcription', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> },
        { id: 'image-generation', name: 'Image Generation', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { id: 'image-editing', name: 'Image Editing', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
        { id: 'video-generation', name: 'Video Generation', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { id: 'image-analysis', name: 'Image Analysis', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10l-2 2m2-2l2 2m-2-2l2-2m-2 2l-2-2" /></svg> },
        { id: 'video-analysis', name: 'Video Analysis', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
        { id: 'thinking-mode', name: 'Thinking Mode', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ];
    
    const renderActiveTool = () => {
        const handleBack = () => setActiveTool(null);
        switch (activeTool) {
            case 'image-generation': return <ImageGenerationTool onBack={handleBack} />;
            case 'image-editing': return <ImageEditingTool onBack={handleBack} />;
            case 'image-analysis': return <ImageAnalysisTool onBack={handleBack} />;
            case 'thinking-mode': return <ThinkingModeTool onBack={handleBack} />;
            case 'live-chat': return <LiveChatTool onBack={handleBack} />;
            case 'audio-transcription': return <AudioTranscriptionTool onBack={handleBack} />;
            case 'video-generation': return <VideoGenerationTool onBack={handleBack} />;
            case 'video-analysis': return <VideoAnalysisTool onBack={handleBack} />;
            default: return null;
        }
    }

    if (activeTool) {
        return renderActiveTool();
    }

    return (
        <div className="h-full p-4 md:p-8 bg-gray-50">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Smart Studio</span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Choose a tool to get started</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {tools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="text-purple-500 mb-4">
                            {tool.icon}
                        </div>
                        <h3 className="font-semibold text-gray-700">{tool.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartStudioPage;