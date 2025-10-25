import { GoogleGenAI, Chat, GenerateContentResponse, Modality, Type, GenerationConfig } from '@google/genai';
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Some features may not function without it.");
}

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const handleApiError = (error: any): Error => {
    console.error("Gemini API Error:", error);
    let message = "An unexpected error occurred with the AI service. Please try again later.";
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            message = "Your API key is not valid. Please check your key in the settings.";
        } else if (error.message.includes('429')) { // Quota exceeded
            message = "You have exceeded your API quota. Please check your usage or upgrade your plan.";
        } else if (error.message.includes('permission')) {
            message = "You do not have permission to use this model with the provided API key.";
        }
    }
    return new Error(message);
}

export const startChat = (systemInstruction?: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        // Fix: Use gemini-2.5-flash for chat as per guidelines.
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction || 'You are SnakeEngine AI, a friendly, creative, and helpful assistant.',
        },
    });
};

export const sendMessage = async (
    chat: Chat, 
    message: string, 
    image?: { base64: string; mimeType: string }
): Promise<GenerateContentResponse> => {
    try {
        let content: any;
        if (image) {
            content = {
                parts: [
                    { text: message },
                    { inlineData: { data: image.base64, mimeType: image.mimeType } }
                ]
            };
        } else {
            content = { message };
        }
        const result = await chat.sendMessage(content);
        return result;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateTextWithGrounding = async (
    prompt: string,
    tool: 'googleSearch' | 'googleMaps',
    location?: { latitude: number, longitude: number }
): Promise<GenerateContentResponse> => {
    const ai = getAI();
    const config: any = {
        tools: tool === 'googleSearch' ? [{ googleSearch: {} }] : [{ googleMaps: {} }],
    };

    if (tool === 'googleMaps' && location) {
        config.toolConfig = { retrievalConfig: { latLng: location } };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: config,
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const textToSpeech = async (text: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say it clearly: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data returned from TTS API.");
        return base64Audio;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: aspectRatio,
            },
        });
        const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
        if (!base64ImageBytes) throw new Error("No image data returned.");
        return base64ImageBytes;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const editImage = async (prompt: string, base64ImageData: string, mimeType: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: { responseModalities: [Modality.IMAGE] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return part.inlineData.data;
        }
        throw new Error("No edited image data returned.");
    } catch (error) {
        throw handleApiError(error);
    }
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [
                { inlineData: { mimeType: mimeType, data: imageBase64 } },
                { text: prompt }
            ]},
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const analyzeVideo = async (prompt: string, videoBase64: string, mimeType: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [
                { inlineData: { mimeType: mimeType, data: videoBase64 } },
                { text: prompt }
            ]},
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateWithThinking = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 32768 } }
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

// Fix: Added missing geminiService functions
export const analyzeSpreadsheet = async (prompt: string, csvData: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Good for data analysis
            contents: `Analyze the following CSV data and answer the user's question. CSV data:\n\n${csvData}\n\nQuestion: ${prompt}`,
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const convertNumberToWords = async (number: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Convert the number "${number}" into its word representation.`,
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generatePdfExtractionGuide = async (description: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `The user wants to extract data from a PDF using Excel. Based on their description, generate a step-by-step guide and a sample VBA macro. Description: "${description}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        guide: { type: Type.STRING, description: "A markdown-formatted step-by-step guide for the user." },
                        vbaMacro: { type: Type.STRING, description: "A sample VBA macro to help with the extraction." },
                    },
                },
            },
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateYouTubeMetadata = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a YouTube title, description, and tags for a video about: "${prompt}".`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["title", "description", "tags"],
                },
            },
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

// Fix: Removed responseMimeType and responseSchema as they are not allowed with the googleSearch tool. Updated prompt to explicitly request JSON.
export const findTrendingYouTubeTopics = async (topic: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find 3 trending YouTube video ideas related to the topic: "${topic}". For each idea, provide a catchy title and a brief concept. Respond with a valid JSON object with a single key "ideas" which is an array of objects. Each object in the array should have two keys: "title" and "concept". Do not include any other text or markdown formatting in your response.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateSocialMediaPost = async (prompt: string, platform: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a social media post for ${platform} about: "${prompt}". Include relevant hashtags.`,
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generatePrompt = async (params: {
    model: string;
    prompt: string;
    systemInstruction?: string;
    generationConfig?: GenerationConfig;
}): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: params.model,
            contents: params.prompt,
            config: {
                systemInstruction: params.systemInstruction,
                ...params.generationConfig,
            }
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateLearningPlan = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planTitle: { type: Type.STRING },
                        planDescription: { type: Type.STRING },
                        modules: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    subTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                                },
                                required: ["title", "description", "subTopics"],
                            },
                        },
                    },
                    required: ["planTitle", "planDescription", "modules"],
                },
            },
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generatePresentationOutline = async (topic: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Create a presentation outline with a main title and 5 content slides for the topic: "${topic}". Each slide should have a title and 3-4 bullet points.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        mainTitle: { type: Type.STRING },
                        slides: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    points: { type: Type.ARRAY, items: { type: Type.STRING } },
                                },
                                required: ["title", "points"],
                            },
                        },
                    },
                    required: ["mainTitle", "slides"],
                },
            },
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateAppSpecification = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        appName: { type: Type.STRING },
                        description: { type: Type.STRING },
                        features: { type: Type.ARRAY, items: { type: Type.STRING } },
                        techStack: {
                            type: Type.OBJECT,
                            properties: {
                                frontend: { type: Type.STRING },
                                backend: { type: Type.STRING },
                                database: { type: Type.STRING },
                            },
                            required: ["frontend", "backend", "database"],
                        },
                        code: {
                            type: Type.OBJECT,
                            properties: {
                                html: { type: Type.STRING },
                                css: { type: Type.STRING },
                                javascript: { type: Type.STRING },
                            },
                            required: ["html", "css", "javascript"],
                        },
                    },
                    required: ["appName", "description", "features", "techStack", "code"],
                },
            },
        });
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateWebsite = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        return await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `${prompt}. Use Tailwind CSS for styling from a CDN. Include some nice imagery from unsplash or similar royalty free sources.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        siteName: { type: Type.STRING },
                        htmlStructure: { type: Type.STRING },
                    },
                    required: ["siteName", "htmlStructure"],
                },
            },
        });
    } catch (error) {
        throw handleApiError(error);
    }
};