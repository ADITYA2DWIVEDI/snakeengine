import React from 'react';
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
    const [prompt, setPrompt] = React.useState('');
    const { isGenerating, videoUrl, error: videoError, progressMessage, generateVideo, isKeySelected, selectApiKey, checkApiKey } = useVeoGenerator();

    const [metadata, setMetadata] = React.useState<YouTubeMetadata | null>(null);
    const [isGeneratingMetadata, setIsGeneratingMetadata] = React.useState(false);
    const [metadataError, setMetadataError] = React.useState<string | null>(null);

    const [isFindingTrends, setIsFindingTrends] = React.useState(false);
    const [trendTopic, setTrendTopic] = React.useState('');
    const [trendingIdeas, setTrendingIdeas] = React.useState<TrendingIdea[] | null>(null);
    const [trendError, setTrendError] = React.useState<string | null>(null);
    
    const [copiedField, setCopiedField] = React.useState<'Title' | 'Description' | 'Tags' | null>(null);

    React.useEffect(() => {
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
            // Fix: Added robust JSON parsing to handle potential markdown wrappers and errors,
            // as response.text is not guaranteed to be JSON when using grounding.
            let responseText = response.text;
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch && jsonMatch[1]) {
                responseText = jsonMatch[1];
            }

            try {
                const parsedResult = JSON.parse(responseText) as { ideas: TrendingIdea[] };
                setTrendingIdeas(parsedResult.ideas);
            } catch (parseError) {
                 console.error("JSON parsing error:", parseError, "Raw text:", responseText);
                 throw new Error("The AI returned an invalid format. Please try again.");
            }
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
                <label className="text-sm font-semibold flex justify-between items-center">
                    <span>Title</span>
                    <button onClick={() => copyToClipboard(metadata.title, 'Title')} className="text-xs flex items-center gap-1 text-slate-500 hover:text-purple-600">
                        {copiedField === 'Title' ? <Icon name="checkmark" className="w-4 h-4 text-green-500"/> : <Icon name="copy" className="w-4 h-4"/>} Copy
                    </button>
                </label>
                <p className="mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-sm">{metadata.title}</p>
            </div>
            <div>
                <label className="text-sm font-semibold flex justify-between items-center">
                    <span>Description</span>
                     <button onClick={() => copyToClipboard(metadata.description, 'Description')} className="text-xs flex items-center gap-1 text-slate-500 hover:text-purple-600">
                        {copiedField === 'Description' ? <Icon name="checkmark" className="w-4 h-4 text-green-500"/> : <Icon name="copy" className="w-4 h-4"/>} Copy
                    </button>
                </label>
                <p className="mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-sm whitespace-pre-wrap">{metadata.description}</p>
            </div>
            <div>
                <label className="text-sm font-semibold flex justify-between items-center">
                    <span>Tags</span>
                     <button onClick={() => copyToClipboard(metadata.tags.join(', '), 'Tags')} className="text-xs flex items-center gap-1 text-slate-500 hover:text-purple-600">
                        {copiedField === 'Tags' ? <Icon name="checkmark" className="w-4 h-4 text-green-500"/> : <Icon name="copy" className="w-4 h-4"/>} Copy
                    </button>
                </label>
                <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md text-sm flex flex-wrap gap-1">
                    {metadata.tags.map(tag => <span key={tag} className="bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full text-xs">{tag}</span>)}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 xl:w-1/4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col gap-4">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2"><Icon name={Feature.YOUTUBE_STUDIO as any} className="w-5 h-5" /> Video Tools</h2>
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <label className="text-sm font-semibold">Video Prompt</label>
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} className="w-full mt-1 bg-white dark:bg-slate-800 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none" placeholder="e.g., A cinematic shot of a wolf howling..."/>
                        {!isKeySelected ? (
                             <div className="mt-2 text-xs p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-md">
                                <p>Video generation requires an API key.</p>
                                <button onClick={selectApiKey} className="font-bold underline">Select API Key</button>
                             </div>
                        ) : (
                             <button onClick={handleGenerateVideo} disabled={isGenerating} className="mt-2 w-full py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 disabled:bg-slate-400 flex items-center justify-center gap-1.5">
                                {isGenerating ? <Spinner/> : <Icon name="video" className="w-4 h-4"/>}
                                {isGenerating ? 'Generating...' : 'Generate Video'}
                            </button>
                        )}
                         <button onClick={handleGenerateMetadata} disabled={isGeneratingMetadata} className="mt-2 w-full py-2 bg-slate-500 text-white text-sm font-semibold rounded-lg hover:bg-slate-600 disabled:bg-slate-400 flex items-center justify-center gap-1.5">
                            {isGeneratingMetadata ? <Spinner/> : <Icon name="edit" className="w-4 h-4"/>}
                            {isGeneratingMetadata ? 'Working...' : 'Generate Metadata'}
                        </button>
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2"><Icon name="search" className="w-5 h-5" /> Find Trends</h2>
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                         <label className="text-sm font-semibold">Topic</label>
                        <input value={trendTopic} onChange={e => setTrendTopic(e.target.value)} className="w-full mt-1 bg-white dark:bg-slate-800 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" placeholder="e.g., AI in gaming"/>
                        <button onClick={handleFindTrends} disabled={isFindingTrends} className="mt-2 w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 disabled:bg-slate-400 flex items-center justify-center gap-1.5">
                            {isFindingTrends ? <Spinner/> : <Icon name="search" className="w-4 h-4"/>}
                            {isFindingTrends ? 'Searching...' : 'Find Ideas'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col md:col-span-2 lg:col-span-1">
                    <h2 className="text-lg font-bold mb-2">Video Preview</h2>
                    <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-lg min-h-[200px]">
                         {isGenerating ? (
                            <div className="text-center p-4">
                                <Spinner />
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{progressMessage}</p>
                                <p className="text-xs text-slate-400">(This can take a few minutes)</p>
                            </div>
                        ) : videoUrl ? (
                            <video src={videoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-md"/>
                        ) : (
                            <div className="text-center p-4 text-slate-400">
                                <Icon name="video" className="w-12 h-12 mx-auto" />
                                <p>Video preview will appear here</p>
                            </div>
                        )}
                        {videoError && <p className="text-red-500 text-sm p-4">{videoError}</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col md:col-span-2 lg:col-span-1">
                    <h2 className="text-lg font-bold mb-2">AI Generated Metadata</h2>
                    <div className="flex-1 bg-slate-100/50 dark:bg-slate-700/20 rounded-lg p-3 overflow-y-auto min-h-[200px]">
                        {isGeneratingMetadata ? (
                            <div className="flex items-center justify-center h-full"><Spinner /></div>
                        ) : metadata ? (
                            <MetadataDisplay metadata={metadata} />
                        ) : (
                             <div className="flex items-center justify-center h-full text-center text-slate-400 p-4">
                                 <div>
                                    <Icon name="edit" className="w-10 h-10 mx-auto" />
                                    <p>YouTube title, description, and tags will appear here.</p>
                                 </div>
                            </div>
                        )}
                         {metadataError && <p className="text-red-500 text-sm">{metadataError}</p>}
                    </div>
                </div>

                 <div className="md:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col">
                    <h2 className="text-lg font-bold mb-2">Trending Video Ideas</h2>
                    <div className="flex-1 bg-slate-100/50 dark:bg-slate-700/20 rounded-lg p-3 overflow-y-auto min-h-[200px]">
                        {isFindingTrends ? (
                            <div className="flex items-center justify-center h-full"><Spinner /></div>
                        ) : trendingIdeas ? (
                             <div className="space-y-3 animate-fade-in">
                                {trendingIdeas.map((idea, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-md shadow-sm">
                                        <p className="font-semibold text-purple-600 dark:text-teal-400">{idea.title}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{idea.concept}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-slate-400 p-4">
                                 <div>
                                    <Icon name="search" className="w-10 h-10 mx-auto" />
                                    <p>Trending ideas for your topic will appear here.</p>
                                 </div>
                            </div>
                        )}
                        {trendError && <p className="text-red-500 text-sm">{trendError}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeView;