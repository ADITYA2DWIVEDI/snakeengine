import { GoogleGenAI, Modality, LiveSession, LiveServerMessage, CloseEvent, ErrorEvent, Blob, Type } from "@google/genai";
import { Course, AIRecommendation, Message } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock response.");
}

const getAiClient = () => {
    // Re-initialize every time to ensure the latest key from the Veo dialog is used.
    return API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
}

const handleApiError = (error: unknown, context: string): string => {
    console.error(`Error in ${context}:`, error);
    const message = error instanceof Error ? error.message : "An unknown error occurred.";

    if (message.includes("API key not valid")) {
        return `Your API key is not valid. Please check your credentials. Details: ${message}`;
    }
    if (message.includes("quota")) {
        return `You have exceeded your API quota. Please check your plan and billing details. Details: ${message}`;
    }
    return `Sorry, an error occurred in ${context}. Details: ${message}`;
};

export const generateChatResponse = async (prompt: string, history: Message[], systemInstruction?: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API client not available. Please configure your API Key.";

    try {
        // Map the history to the format required by generateContent
        const contents = history.map(item => ({
            role: item.sender === 'ai' ? 'model' as const : 'user' as const,
            parts: [{ text: item.text }],
        }));

        // Add the current user prompt
        contents.push({
            role: 'user',
            parts: [{ text: prompt }],
        });
        
        const response = await ai.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: contents, // The full conversation history
            config: {
                systemInstruction: systemInstruction || "You are SnakeEngine AI, a helpful and friendly assistant.",
            },
        });

        return response.text;
    } catch (error) {
        return handleApiError(error, "Chat");
    }
};

export interface ImageGenerationResult {
    images: string[];
    error?: string;
}

export const generateImage = async (prompt: string, aspectRatio: string): Promise<ImageGenerationResult> => {
    const ai = getAiClient();
    if (!ai) return { images: [], error: "API client not available. Please configure your API Key." };

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
        return { images: [], error: handleApiError(error, "Image Generation") };
    }
};

export const editImage = async (prompt: string, image: { data: string; mimeType: string }): Promise<ImageGenerationResult> => {
    const ai = getAiClient();
    if (!ai) return { images: [], error: "API client not available. Please configure your API Key." };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ inlineData: image }, { text: prompt }] },
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
        return { images: [], error: handleApiError(error, "Image Editing") };
    }
};

export const analyzeImage = async (prompt: string, image: { data: string; mimeType: string }): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API client not available. Please configure your API Key.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ inlineData: image }, { text: prompt }] },
        });
        return response.text;
    } catch (error) {
        return handleApiError(error, "Image Analysis");
    }
};

export const generateThinkingResponse = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API client not available. Please configure your API Key.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: "You are SnakeEngine AI, operating in 'Thinking Mode'. Provide deep, thoughtful, and well-reasoned responses to complex questions.",
                thinkingConfig: { thinkingBudget: 32768 }
            },
        });
        return response.text;
    } catch (error) {
        return handleApiError(error, "Thinking Mode");
    }
};

export const connectLiveChat = (callbacks: { onopen: () => void; onmessage: (message: LiveServerMessage) => Promise<void>; onerror: (e: ErrorEvent) => void; onclose: (e: CloseEvent) => void; }): Promise<LiveSession> => {
    const ai = getAiClient();
    if (!ai) throw new Error("Gemini AI client not initialized. Please set your API Key.");
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
            inputAudioTranscription: {}, outputAudioTranscription: {},
            systemInstruction: 'You are a friendly and helpful AI assistant named SnakeEngine AI.',
        },
    });
};

export const transcribeAudio = async (audio: { data: string; mimeType: string }): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API client not available. Please configure your API Key.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ inlineData: audio }, { text: "Transcribe this audio file." }] },
        });
        return response.text;
    } catch (error) {
        return handleApiError(error, "Audio Transcription");
    }
};

export const generateVideo = async (prompt: string, aspectRatio: string, image?: { data: string, mimeType: string }): Promise<any> => {
    const ai = getAiClient();
    if (!ai) throw new Error("API client not available. Please configure your API Key.");

    const imagePayload = image ? { imageBytes: image.data, mimeType: image.mimeType } : undefined;

    return ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        image: imagePayload,
        config: { 
            numberOfVideos: 1, 
            resolution: '720p', 
            aspectRatio: aspectRatio as '16:9' | '9:16'
        }
    });
};

export const getVideosOperation = async (operation: any): Promise<any> => {
    const ai = getAiClient();
    if (!ai) throw new Error("API client not available. Please configure your API Key.");
    return ai.operations.getVideosOperation({ operation });
};

export const analyzeVideo = async (prompt: string, video: { data: string, mimeType: string }): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API client not available. Please configure your API Key.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [{ inlineData: video }, { text: prompt }] },
        });
        return response.text;
    } catch (error) {
        return handleApiError(error, "Video Analysis");
    }
};

export const generateGroundedResponse = async (prompt: string) => {
    const ai = getAiClient();
    if (!ai) return { text: "API client not available. Please configure your API Key.", sources: [] };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] },
        });
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => c.web) || [];
        return { text: response.text, sources };
    } catch (error) {
        return { text: handleApiError(error, "Web Search"), sources: [] };
    }
};

export const generateMapsResponse = async (prompt: string, location: { latitude: number, longitude: number }) => {
    const ai = getAiClient();
    if (!ai) return { text: "API client not available. Please configure your API Key.", places: [] };
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: { retrievalConfig: { latLng: location } }
            },
        });
        const places = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(c => c.maps) || [];
        return { text: response.text, places };
    } catch (error) {
        return { text: handleApiError(error, "Local Discovery"), places: [] };
    }
};

export const generateSpeech = async (prompt: string, voice: string) => {
    const ai = getAiClient();
    if (!ai) return { audio: null, error: "API client not available. Please configure your API Key." };
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data returned from API.");
        return { audio: base64Audio, error: null };
    } catch (error) {
        return { audio: null, error: handleApiError(error, "Text to Speech") };
    }
};

export const getCourseRecommendations = async (goal: string, courses: Course[]) => {
    const ai = getAiClient();
    if (!ai) return { recommendations: null, error: "API client not available. Please configure your API Key." };
    
    const courseListForPrompt = courses.map(c => `- Course ID ${c.id}: "${c.title}" (Tags: ${c.tags.join(', ')})`).join('\n');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `My goal is: "${goal}". Based on the following list of available courses, which 3-5 courses are the most relevant? For each recommended course, provide its ID and a brief justification for why it's a good fit.

Available Courses:
${courseListForPrompt}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    courseId: { type: Type.NUMBER },
                                    justification: { type: Type.STRING },
                                },
                                required: ["courseId", "justification"],
                            },
                        },
                    },
                    required: ["recommendations"],
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return { recommendations: jsonResponse.recommendations as AIRecommendation[], error: null };
    } catch (error) {
        return { recommendations: null, error: handleApiError(error, "Course Recommendation") };
    }
};

export const generateStudyPlan = async (goal: string, courses: Course[]) => {
    const ai = getAiClient();
    if (!ai) return { plan: null, error: "API client not available. Please configure your API Key." };

    const courseListForPrompt = courses.map(c => `Course ID ${c.id}: "${c.title}" (Tags: ${c.tags.join(', ')})`).join('\n');

    try {
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `My goal is: "${goal}". Create a structured, week-by-week study plan to achieve this goal using the provided course list. The plan should have a title. Each week should have a focus and recommend 2-4 relevant courses by their ID, including a brief justification for each choice.

Available Courses:
${courseListForPrompt}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planTitle: { type: Type.STRING },
                        weeklyPlan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    week: { type: Type.NUMBER },
                                    title: { type: Type.STRING },
                                    courses: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                courseId: { type: Type.NUMBER },
                                                justification: { type: Type.STRING },
                                            },
                                            required: ["courseId", "justification"],
                                        },
                                    },
                                },
                                required: ["week", "title", "courses"],
                            },
                        },
                    },
                    required: ["planTitle", "weeklyPlan"],
                },
            },
        });
        const jsonResponse = JSON.parse(response.text);
        return { plan: jsonResponse, error: null };
    } catch (error) {
        return { plan: null, error: handleApiError(error, "Study Plan Generation") };
    }
};

export const reviewCodeSnippet = async (code: string, language: string) => {
    const ai = getAiClient();
    if (!ai) return { review: null, error: "API client not available. Please configure your API Key." };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Please act as a senior software engineer and provide a code review for the following ${language} snippet. Focus on potential bugs, performance improvements, and best practices. Format your response as Markdown.

\`\`\`${language}
${code}
\`\`\``
        });
        return { review: response.text, error: null };
    } catch (error) {
        return { review: null, error: handleApiError(error, "Code Review") };
    }
};

export const summarizeDocument = async (content: string) => {
    const ai = getAiClient();
    if (!ai) return { summary: null, error: "API client not available. Please configure your API Key." };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please provide a concise summary of the following document:\n\n---\n\n${content}`
        });
        return { summary: response.text, error: null };
    } catch (error) {
        return { summary: null, error: handleApiError(error, "Document Summarizer") };
    }
};