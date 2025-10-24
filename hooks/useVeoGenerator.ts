
import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface VeoGenerationParams {
    prompt: string;
    image?: {
        imageBytes: string;
        mimeType: string;
    };
    aspectRatio: '16:9' | '9:16';
}

declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    interface Window {
        aistudio?: AIStudio;
    }
}

export const useVeoGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState<string>('');
    const [isKeySelected, setIsKeySelected] = useState(false);

    const pollingTimeout = useRef<number | null>(null);

    const cleanup = useCallback(() => {
        if (pollingTimeout.current) {
            clearTimeout(pollingTimeout.current);
            pollingTimeout.current = null;
        }
        setIsGenerating(false);
        setProgressMessage('');
    }, []);
    
    const checkApiKey = useCallback(async () => {
        if (!window.aistudio) {
             setError("AISTUDIO environment not found. This feature requires the AISTUDIO environment.");
             return false;
        }
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(hasKey);
        return hasKey;
    }, []);


    const selectApiKey = async () => {
        if (window.aistudio) {
            try {
                await window.aistudio.openSelectKey();
                // Assume success after opening dialog to handle race conditions
                setIsKeySelected(true);
                setError(null);
            } catch (e) {
                console.error("Error opening API key selection:", e);
                setError("Failed to open API key selection dialog.");
            }
        }
    };


    const generateVideo = useCallback(async ({ prompt, image, aspectRatio }: VeoGenerationParams) => {
        setIsGenerating(true);
        setVideoUrl(null);
        setError(null);

        try {
             if (!process.env.API_KEY) {
                const hasKey = await checkApiKey();
                if (!hasKey) {
                   setError("Please select an API key to generate videos. Ensure it has the 'Generative Language API' enabled and billing is set up.");
                   setIsGenerating(false);
                   return;
                }
            }
            
            setProgressMessage('Initializing video generation engine...');
            
            // Re-create AI instance to use the latest key
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            setProgressMessage('Sending configuration to the model...');
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                ...(image && { image }),
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: aspectRatio,
                }
            });

            setProgressMessage('Video processing has started. This may take a few minutes...');

            const pollOperation = async () => {
                try {
                    setProgressMessage('Checking generation status...');
                    operation = await ai.operations.getVideosOperation({ operation: operation });

                    if (operation.done) {
                        cleanup();
                        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
                        if (downloadLink) {
                            setProgressMessage('Finalizing and fetching generated video...');
                             const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                             if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
                             const blob = await response.blob();
                             const url = URL.createObjectURL(blob);
                             setVideoUrl(url);
                             setProgressMessage('Video is ready!');
                        } else {
                             const opError = (operation as any).error;
                             const errorMessage = opError ? `${opError.message} (Code: ${opError.code})` : 'Video generation finished, but no video URI was found.';
                             setError(errorMessage);
                        }
                    } else {
                        setProgressMessage('Still processing... This can take a few minutes. Please wait.');
                        pollingTimeout.current = window.setTimeout(pollOperation, 10000);
                    }
                } catch (e: any) {
                    console.error('Polling error:', e);
                    if (e.message.includes('Requested entity was not found')) {
                         setError('API key error. Your key may be invalid, lack permissions, or the project may not have billing enabled. Please select your key again.');
                         setIsKeySelected(false);
                    } else {
                         setError(`An error occurred during polling: ${e.message}`);
                    }
                    cleanup();
                }
            };
            pollingTimeout.current = window.setTimeout(pollOperation, 10000); // Poll every 10 seconds

        } catch (e: any) {
            console.error('Video generation error:', e);
             if (e.message.includes('Requested entity was not found')) {
                 setError('API key error. Your key may be invalid, lack permissions, or the project may not have billing enabled. Please select your key again.');
                 setIsKeySelected(false);
            } else {
                 setError(`Failed to start video generation: ${e.message}`);
            }
            cleanup();
        }
    }, [checkApiKey, cleanup]);
    
    useEffect(() => {
        return () => {
            cleanup();
        }
    }, [cleanup]);

    return { isGenerating, videoUrl, error, progressMessage, generateVideo, isKeySelected, selectApiKey, checkApiKey };
};
