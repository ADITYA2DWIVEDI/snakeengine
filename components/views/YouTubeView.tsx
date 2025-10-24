

import React, { useState, useEffect } from 'react';
import { Page, Feature } from '../../types';
import { Icon } from '../icons';
import { useVeoGenerator } from '../../hooks/useVeoGenerator';
import { generateYouTubeMetadata, findTrendingYouTubeTopics } from '../../services/geminiService';
import Spinner from '../common/Spinner';

interface YouTubeMetadata {
    title: string;
    description: string;
    tags: string[];
}

interface TrendingIdea {
    title: string;
    concept: string;
}

const YouTubeView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const { isGenerating, videoUrl, error: videoError, progressMessage, generateVideo, isKeySelected, selectApiKey, checkApiKey } = useVeoGenerator();

    const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
    const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
    const [metadataError, setMetadataError] = useState<string | null>(null);

    const [isFindingTrends, setIsFindingTrends] = useState(false);
    const [trendTopic, setTrendTopic] = useState('');
    const [trendingIdeas, setTrendingIdeas] = useState<TrendingIdea[] | null>(null);
    const [trendError, setTrendError] = useState<string | null>(null);
    
    const [copiedField, setCopiedField] = useState<'Title' | 'Description' | 'Tags' | null>(null);

    useEffect(() => {
        checkApiKey();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGenerateVideo = async () => {
        if (!prompt.trim()) {
            alert('Please enter a prompt to generate the video.');
            return;
        }
        setMetadata(null); // Clear previous metadata
        setMetadataError(null);
        await generateVideo({ prompt, aspectRatio: '16:9' });
    };

    const handleGenerateMetadata = async () => {
        if (!prompt.trim()) {
            setMetadataError('A prompt is required to generate metadata.');
            return;
        }
        setIsGeneratingMetadata(true);
        setMetadataError(null);
        try {
            const response = await generateYouTubeMetadata(prompt);
            let responseText = response.text;

            // The model might wrap the JSON in markdown backticks. Let's strip them.
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                responseText = jsonMatch[1];
            }

            try {
                const parsedResult = JSON.parse(responseText) as YouTubeMetadata;
                setMetadata(parsedResult);
            } catch (parseError) {
                 console.error("JSON parsing error:", parseError, "Raw text:", responseText);
                 throw new Error("The AI returned an invalid format. Please try again.");
            }
        } catch (e: any) {
            console.error("Metadata generation error:", e);
            setMetadataError(`Failed to generate metadata: ${e.message}`);
        } finally {
            setIsGeneratingMetadata(false);
        }
    };

    const handleFindTrends = async () => {
        if (!trendTopic.trim()) {
            setTrendError('Please enter a topic to search for trends.');
            return;
        }
        setIsFindingTrends(true);
        setTrendError(null);
        setTrendingIdeas(null);
        try {
            const response = await findTrendingYouTubeTopics(trendTopic);
            const parsedResult = JSON.parse(response.text) as { ideas: TrendingIdea[] };
            setTrendingIdeas(parsedResult.ideas);
        } catch (e: any) {
            console.error("Trending topics error:", e);
            setTrendError(`Failed to find trends: ${e.message}`);
        } finally {
            setIsFindingTrends(false);
        }
    };
    
    const copyToClipboard = (text: string, field: 'Title' | 'Description' | 'Tags') => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const MetadataDisplay: React.FC<{ metadata: YouTubeMetadata }> = ({ metadata }) => (
        <div className="space-y-4 animate-fade-in">
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
                <div className="relative">
                    <textarea value={metadata.title} readOnly className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 text-sm resize-none" rows={2}/>
                    <button onClick={() => copyToClipboard(metadata.title, 'Title')} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500">
                        <Icon name={copiedField === 'Title' ? 'checkmark' : 'paperclip'} className="w-4 h-4" />
                    </button>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
                 <div className="relative">
                    <textarea value={metadata.description} readOnly className="w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-md p-2 text-sm resize-none"/>
                     <button onClick={() => copyToClipboard(metadata.description, 'Description')} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500">
                        <Icon name={copiedField === 'Description' ? 'checkmark' : 'paperclip'} className="w-4 h-4" />
                    </button>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Tags</label>
                 <div className="relative">
                    <textarea value={metadata.tags.join(', ')} readOnly className="w-full h-24 bg-slate-100 dark:bg-slate-700 rounded-md p-2 text-sm resize-none"/>
                     <button onClick={() => copyToClipboard(metadata.tags.join(', '), 'Tags')} className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500">
                        <Icon name={copiedField === 'Tags' ? 'checkmark' : 'paperclip'} className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            {/* Left Panel: Controls */}
            <div className="w-full md:w-1/3 flex-shrink-0 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    {/* Fix: Replace non-existent Page.YOUTUBE_CREATOR with 'youtube' icon name. */}
                    <Icon name={'youtube'} className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">YouTube Creator</h1>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-shrink-0">Generate a 16:9 video and get AI-powered titles, descriptions, and tags for your YouTube content.</p>

                <div className="flex flex-col flex-1">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Video Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A cinematic drone shot flying through a futuristic city at sunset"
                        className="w-full flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-teal-500 resize-none"
                    />
                </div>

                {!isKeySelected ? (
                    <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
                        <p className="mb-2 font-semibold">API Key Required</p>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900 dark:hover:text-yellow-100">Learn about billing</a>
                        <button onClick={selectApiKey} className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                            Select API Key
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleGenerateVideo}
                        disabled={isGenerating}
                        className="w-full mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isGenerating ? <Spinner /> : <Icon name="video" className="w-5 h-5"/>}
                        {isGenerating ? 'Generating Video...' : 'Generate Video'}
                    </button>
                )}
                {videoError && <p className="text-red-500 text-sm mt-2 text-center">{videoError}</p>}
                
                {/* Trend Finder */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Find Trending Topics</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Stuck for ideas? Find what's currently trending for your topic.</p>
                     <div className="flex gap-2">
                        <input
                            type="text"
                            value={trendTopic}
                            onChange={(e) => setTrendTopic(e.target.value)}
                            placeholder="e.g., AI, Gaming"
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <button onClick={handleFindTrends} disabled={isFindingTrends} className="px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-500 disabled:bg-slate-400">
                            {isFindingTrends ? <Spinner /> : 'Find'}
                        </button>
                    </div>
                    {trendError && <p className="text-red-500 text-xs mt-2">{trendError}</p>}
                    {trendingIdeas && (
                        <div className="mt-4 space-y-2">
                            {trendingIdeas.map((idea, index) => (
                                <div key={index} className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{idea.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{idea.concept}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Results */}
            <div className="flex-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    {/* Video Preview */}
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Video Preview</h2>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex items-center justify-center p-4 aspect-video">
                            {isGenerating ? (
                                <div className="text-center">
                                    <Spinner />
                                    <p className="mt-4 text-slate-500 dark:text-slate-400">{progressMessage || "Preparing..."}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">(This can take several minutes)</p>
                                </div>
                            ) : videoUrl ? (
                                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <div className="text-center text-slate-500">
                                    <Icon name="video" className="w-16 h-16 mx-auto mb-2" />
                                    <p>Your generated video will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Generated Metadata</h2>
                            <button
                                onClick={handleGenerateMetadata}
                                disabled={isGeneratingMetadata || !prompt}
                                className="px-4 py-2 bg-purple-600 dark:bg-teal-600 text-white font-semibold rounded-lg hover:bg-purple-500 dark:hover:bg-teal-500 transition-colors text-sm disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isGeneratingMetadata ? <Spinner /> : <Icon name="brain" className="w-4 h-4"/>}
                                Generate
                            </button>
                        </div>
                         <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-lg">
                            {isGeneratingMetadata ? (
                                 <div className="h-full flex flex-col items-center justify-center text-center">
                                    <Spinner />
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">Generating metadata...</p>
                                </div>
                            ) : metadata ? (
                                <MetadataDisplay metadata={metadata} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                                    <Icon name="grid" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Click "Generate" to create a title, description, and tags.</p>
                                </div>
                            )}
                            {metadataError && <p className="text-red-500 text-sm mt-2">{metadataError}</p>}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeView;