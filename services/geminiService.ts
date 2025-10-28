import { GoogleGenAI, Modality, LiveSession, LiveServerMessage, CloseEvent, ErrorEvent, Blob } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock response.");
}

const getAiClient = () => {
    return API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
}

const MOCK_RESPONSE = "This is a mock response. To use the real Gemini API, please set your API_KEY environment variable.";

export const generateChatResponse = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return MOCK_RESPONSE;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are SnakeEngine AI, a helpful and friendly assistant.",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};

export interface ImageGenerationResult {
    images: string[];
    error?: string;
}

export const generateImage = async (prompt: string, aspectRatio: string): Promise<ImageGenerationResult> => {
    const ai = getAiClient();
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { images: [], error: "Image generation is not available. Please configure your API Key." };
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });
        
        const images = response.generatedImages.map(img => img.image.imageBytes);
        return { images };

    } catch (error) {
        console.error("Error generating image:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { images: [], error: `Sorry, I encountered an error while generating the image. Details: ${errorMessage}` };
    }
};

export const editImage = async (prompt: string, image: { data: string; mimeType: string }): Promise<ImageGenerationResult> => {
    const ai = getAiClient();
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { images: [], error: "Image editing is not available. Please configure your API Key." };
    }

    try {
        const imagePart = { inlineData: { data: image.data, mimeType: image.mimeType } };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return { images: [part.inlineData.data] };
            }
        }
        return { images: [], error: "The model did not return an image. Please try a different prompt." };
    } catch (error) {
        console.error("Error editing image:", error);
        return { images: [], error: "Sorry, I encountered an error while editing the image." };
    }
};

export const analyzeImage = async (prompt: string, image: { data: string; mimeType: string }): Promise<string> => {
    const ai = getAiClient();
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return "Image analysis is not available. Please configure your API Key.";
    }

    try {
        const imagePart = { inlineData: { data: image.data, mimeType: image.mimeType } };
        const textPart = { text: prompt };
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Sorry, I encountered an error while analyzing the image.";
    }
};

export const generateThinkingResponse = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
     if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return MOCK_RESPONSE;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: "You are SnakeEngine AI, operating in 'Thinking Mode'. Provide deep, thoughtful, and well-reasoned responses to complex questions.",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating thinking response:", error);
        return "Sorry, I encountered an error in Thinking Mode. Please try again.";
    }
};

export const connectLiveChat = (callbacks: {
    onopen: () => void;
    onmessage: (message: LiveServerMessage) => Promise<void>;
    onerror: (e: ErrorEvent) => void;
    onclose: (e: CloseEvent) => void;
}): Promise<LiveSession> => {
    const ai = getAiClient();
    if (!ai) {
        throw new Error("Gemini AI client not initialized. Please set your API Key.");
    }
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: 'You are a friendly and helpful AI assistant named SnakeEngine AI.',
        },
    });
};

export const transcribeAudio = async (audio: { data: string; mimeType: string }): Promise<string> => {
    const ai = getAiClient();
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return "Audio transcription is not available. Please configure your API Key.";
    }
    try {
        const audioPart = { inlineData: { data: audio.data, mimeType: audio.mimeType } };
        const textPart = { text: "Transcribe this audio file." };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a powerful model for better accuracy
            contents: { parts: [audioPart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        return "Sorry, I encountered an error while transcribing the audio.";
    }
};

export const generateVideo = async (prompt: string): Promise<any> => {
    const ai = getAiClient();
    if (!ai) {
        throw new Error("Video generation is not available. Please configure your API Key.");
    }
    return ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
};

export const getVideosOperation = async (operation: any): Promise<any> => {
    const ai = getAiClient();
    if (!ai) {
        throw new Error("Video generation is not available. Please configure your API Key.");
    }
    return ai.operations.getVideosOperation({ operation });
};

export const analyzeVideo = async (prompt: string, video: { data: string, mimeType: string }): Promise<string> => {
    const ai = getAiClient();
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return "Video analysis is not available. Please configure your API Key.";
    }
    try {
        const videoPart = { inlineData: { data: video.data, mimeType: video.mimeType } };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [videoPart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing video:", error);
        return "Sorry, I encountered an error while analyzing the video. The model may only be able to analyze the audio track.";
    }
};
