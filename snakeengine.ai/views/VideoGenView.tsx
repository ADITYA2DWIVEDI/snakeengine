import React, { useState, useEffect, useRef } from 'react';
import { generateVideo, checkApiKey, openApiKeyDialog, fileToGenerativePart } from '../services/geminiService';
import { VideoIcon, PaperclipIcon, TrashIcon } from '../components/Icons';
import { Operation, GenerateVideosResponse, Part } from '@google/genai';
import { useUsageTracker } from '../hooks/useUsageTracker';

const loadingSteps = [
    { progress: 10, message: "Warming up the AI's creative circuits..." },
    { progress: 25, message: "Analyzing your prompt and reference..." },
    { progress: 40, message: "Storyboarding the main scenes..." },
    { progress: 60, message: "Rendering the initial frames..." },
    { progress: 80, message: "Upscaling to high definition..." },
    { progress: 95, message: "Adding the final touches..." },
    { progress: 100, message: "Your video is ready!" },
];

const TOTAL_FREE_VIDEOS = 50;

export const VideoGenView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [length, setLength] = useState<4 | 7>(4);
    const [style, setStyle] = useState<string>('cinematic');
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(loadingSteps[0].message);
    const [hasApiKey, setHasApiKey] = useState(true); // Assume true initially to avoid flicker
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { count, increment, hasUses } = useUsageTracker('videoGen', TOTAL_FREE_VIDEOS);

    useEffect(() => {
        const checkKey = async () => {
            const hasKey = await checkApiKey();
            setHasApiKey(hasKey);
        };
        checkKey();
    }, []);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            setLoadingProgress(5);
            setLoadingMessage(loadingSteps[0].message);
            let stepIndex = 0;
            interval = window.setInterval(() => {
                stepIndex++;
                if(stepIndex < loadingSteps.length -1){
                    const currentStep = loadingSteps[stepIndex];
                    setLoadingProgress(currentStep.progress);
                    setLoadingMessage(currentStep.message);
                }
            }, 5000); // Update message every 5 seconds
        }
        return () => {
            clearInterval(interval);
            setLoadingProgress(0);
        }
    }, [isLoading]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setReferenceImage(event.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!hasUses()) {
            setError('You have used all your free video generations.');
            return;
        }
        if (!prompt) {
            setError('Please enter a prompt.');
            return;
        }

        const hasKey = await checkApiKey();
        if (!hasKey) {
            await openApiKeyDialog();
            const keySelected = await checkApiKey();
             if (!keySelected) {
                setError("API Key selection is required to generate videos.");
                return;
            }
            setHasApiKey(true);
        }

        setIsLoading(true);
        setError(null);
        setGeneratedVideo(null);
        
        try {
            let imagePart: Part | undefined = undefined;
            if (referenceImage) {
                imagePart = await fileToGenerativePart(referenceImage);
            }

            const videoUrl = await generateVideo({
                prompt,
                aspectRatio,
                length,
                style,
                image: imagePart
            }, (op: Operation<GenerateVideosResponse>) => {
                console.log('Polling operation:', op);
            });

            setLoadingProgress(100);
            setLoadingMessage(loadingSteps[loadingSteps.length-1].message);
            setGeneratedVideo(videoUrl);
            increment();
        } catch (err: any) {
            console.error("Video generation failed:", err);
            setError(err.message || 'Failed to generate video. Please try again.');
            if (err.message?.includes("Requested entity was not found")) {
                setHasApiKey(false);
                setError("API Key not found. Please select a valid key.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!hasApiKey) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center p-4">
                <div className="p-8 rounded-2xl glass-pane text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">API Key Required</h2>
                    <p className="text-text-secondary mb-6">Video generation is a premium feature and requires a user-selected API key to proceed.</p>
                    <p className="text-xs text-slate-500 mb-6">For more information on billing and API keys, please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-brand-purple underline">official documentation</a>.</p>
                    <button 
                        onClick={async () => { await openApiKeyDialog(); setHasApiKey(true); }}
                        className="py-2 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80"
                    >
                        Select API Key
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary gradient-text">Advanced AI Video Generation</h1>
                <p className="text-text-secondary mt-1">Bring your ideas to life with fine-tuned creative control.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                <div className="lg:w-1/3 space-y-6">
                    <div className="p-6 rounded-2xl glass-pane">
                        <label htmlFor="prompt" className="block text-sm font-medium text-text-primary mb-2">1. Enter your prompt</label>
                        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A cinematic shot of a wolf howling at the moon" className="w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition text-text-primary placeholder:text-text-secondary" rows={3}/>
                    </div>

                    <div className="p-6 rounded-2xl glass-pane">
                        <label className="block text-sm font-medium text-text-primary mb-2">2. Upload Reference Image (Optional)</label>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        {referenceImage ? (
                             <div className="flex items-center justify-between p-2 bg-slate-100 rounded-lg">
                                 <p className="text-sm text-text-primary truncate">{referenceImage.name}</p>
                                 <button onClick={() => setReferenceImage(null)} className="p-1 text-slate-500 hover:text-brand-red">
                                     <TrashIcon className="w-4 h-4" />
                                 </button>
                             </div>
                        ) : (
                            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border-color rounded-lg text-text-secondary hover:bg-slate-50 transition-colors">
                                <PaperclipIcon className="w-5 h-5" /> Attach Image
                            </button>
                        )}
                    </div>
                    
                    <div className="p-6 rounded-2xl glass-pane grid grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="length" className="block text-sm font-medium text-text-primary mb-2">3. Length</label>
                             <select id="length" value={length} onChange={(e) => setLength(parseInt(e.target.value) as 4 | 7)} className="w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition text-text-primary">
                                 <option value={4}>4 seconds</option>
                                 <option value={7}>7 seconds</option>
                             </select>
                        </div>
                        <div>
                            <label htmlFor="style" className="block text-sm font-medium text-text-primary mb-2">4. Style</label>
                            <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-3 bg-white rounded-lg border border-border-color focus:ring-2 focus:ring-brand-purple focus:outline-none transition text-text-primary">
                                <option value="cinematic">Cinematic</option>
                                <option value="cartoon">Cartoon</option>
                                <option value="documentary">Documentary</option>
                                <option value="anime">Anime</option>
                                <option value="fantasy">Fantasy</option>
                            </select>
                        </div>
                         <div className="col-span-2">
                            <label className="block text-sm font-medium text-text-primary mb-2">5. Aspect Ratio</label>
                            <div className="flex gap-4">
                                <button onClick={() => setAspectRatio('16:9')} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${aspectRatio === '16:9' ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' : 'border-border-color bg-white text-text-primary'}`}>Landscape (16:9)</button>
                                <button onClick={() => setAspectRatio('9:16')} className={`flex-1 p-3 rounded-lg border-2 transition-colors ${aspectRatio === '9:16' ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' : 'border-border-color bg-white text-text-primary'}`}>Portrait (9:16)</button>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <button onClick={handleGenerate} disabled={isLoading || !hasUses()} className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg shadow-lg hover:bg-brand-purple/80 transition-all disabled:opacity-50 hover:shadow-glow-purple">
                            {isLoading ? 'Generating...' : 'Generate Video'}
                        </button>
                        <div className="text-center mt-2 text-sm text-text-secondary">
                             {hasUses() ? (
                                <p>{TOTAL_FREE_VIDEOS - count} / {TOTAL_FREE_VIDEOS} free generations remaining.</p>
                             ) : (
                                <p>No free generations left. <a href="#" className="text-brand-purple font-semibold hover:underline">Upgrade to Pro</a>.</p>
                             )}
                        </div>
                    </div>
                    {error && <p className="text-sm text-brand-red mt-2">{error}</p>}
                </div>

                <div className="flex-1 flex items-center justify-center p-6 rounded-2xl glass-pane bg-bg-secondary/50 min-h-[400px]">
                    {isLoading && (
                        <div className="text-center w-full max-w-sm">
                            <VideoIcon className="w-16 h-16 text-brand-purple animate-pulse mx-auto" />
                            <p className="mt-4 text-text-primary font-medium">{loadingMessage}</p>
                             <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                                <div className="bg-brand-purple h-2.5 rounded-full transition-all duration-1000" style={{ width: `${loadingProgress}%` }}></div>
                            </div>
                            <p className="text-xs text-text-secondary mt-2">This can take a few minutes. Please don't close this tab.</p>
                        </div>
                    )}
                    {!isLoading && generatedVideo && (
                        <video src={generatedVideo} controls autoPlay loop className="rounded-lg shadow-2xl max-h-full max-w-full object-contain" />
                    )}
                    {!isLoading && !generatedVideo && (
                        <div className="text-center text-text-secondary">
                            <VideoIcon className="w-16 h-16 mx-auto mb-4" />
                            <p>Your generated video will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
