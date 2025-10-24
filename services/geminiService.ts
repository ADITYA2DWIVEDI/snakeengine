

import { GoogleGenAI, Chat, GenerateContentResponse, Modality, Type, GenerationConfig } from '@google/genai';
import { AspectRatio, SocialPlatform, AIPersonality } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. The application may not function without it.");
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

export const getSystemInstruction = (): string => {
    const personality = localStorage.getItem('snakeEngineAIPersonality') as AIPersonality || 'Assistant';
    switch (personality) {
        case 'Creative':
            return 'You are SnakeEngine AI. Your persona is creative, playful, and full of ideas. You use emojis and a friendly, informal tone.';
        case 'Professional':
            return 'You are SnakeEngine AI, a formal and professional assistant. Provide well-structured, precise, and polite responses suitable for a business context.';
        case 'Concise':
            return 'You are SnakeEngine AI. Be concise and to the point. Provide direct answers without unnecessary filler or conversation.';
        case 'Assistant':
        default:
            return 'You are SnakeEngine AI, a friendly, creative, and helpful assistant. Your responses should be informative and engaging.';
    }
}

export const startChat = (systemInstruction?: string): Chat => {
    const ai = getAI();
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction === undefined ? getSystemInstruction() : systemInstruction,
        },
    });
};

export const generatePrompt = async (params: {
    model: string;
    prompt: string;
    systemInstruction?: string;
    generationConfig?: GenerationConfig;
}): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: params.model,
            contents: params.prompt,
            config: {
                systemInstruction: params.systemInstruction,
                ...params.generationConfig,
            },
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const createChatSession = (): Chat => {
    return startChat('You are SnakeEngine AI, a friendly, creative, and helpful assistant. Your responses should be informative and engaging.');
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
        config.toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            }
        };
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
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from TTS API.");
        }
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
        if (!base64ImageBytes) {
            throw new Error("No image data returned from image generation API.");
        }
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
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No edited image data returned.");

    } catch (error) {
        throw handleApiError(error);
    }
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: imageBase64,
        },
    };
    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const analyzeVideo = async (prompt: string, videoBase64: string, mimeType: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    const videoPart = {
        inlineData: {
            mimeType: mimeType,
            data: videoBase64,
        },
    };
    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [videoPart, textPart] },
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateWithThinking = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 } // max budget for 2.5-pro
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const analyzeSpreadsheet = async (prompt: string, data: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user has provided the following CSV data:\n\n${data}\n\nBased on this data, please answer the following question: "${prompt}"`,
            config: {
                systemInstruction: "You are an expert spreadsheet analyst. Analyze the provided data and answer the user's question concisely."
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const convertNumberToWords = async (number: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Convert the following number into words, suitable for a check or legal document: ${number}. Only return the text representation of the number. For example, for "123.45", return "One Hundred Twenty-Three and 45/100".`,
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generatePdfExtractionGuide = async (description: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `The user wants to extract the following data from a PDF into Excel: "${description}". 
            
            Please generate two things in a JSON object:
            1. A simple, step-by-step guide for a non-technical user on how to use Microsoft Excel's built-in "Get Data > From File > From PDF" feature to achieve this. The guide should be clear, easy to follow, and formatted with markdown.
            2. A simple VBA macro that prompts the user to select a PDF file and then attempts to find and extract a table that might contain the described data. The macro should be well-commented.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        guide: { 
                            type: Type.STRING,
                            description: "Step-by-step guide for using Excel's Get Data from PDF feature."
                        },
                        vbaMacro: { 
                            type: Type.STRING,
                            description: "A simple, commented VBA macro for extracting data from a PDF."
                        }
                    }
                }
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateAppSpecification = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                systemInstruction: "You are an expert software architect and full-stack developer. Based on the user's prompt, generate a complete application specification. Provide a thoughtful tech stack and generate clear, simple, and functional boilerplate code for HTML, CSS, and JavaScript.",
                responseMimeType: "application/json",
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
                                database: { type: Type.STRING }
                            },
                            required: ['frontend', 'backend', 'database']
                        },
                        code: {
                            type: Type.OBJECT,
                            properties: {
                                html: { type: Type.STRING },
                                css: { type: Type.STRING },
                                javascript: { type: Type.STRING }
                            },
                             required: ['html', 'css', 'javascript']
                        }
                    },
                    required: ['appName', 'description', 'features', 'techStack', 'code']
                }
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateWebsite = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                systemInstruction: "You are an expert web designer and developer. Based on the user's prompt, generate a complete, single-file responsive HTML document. The HTML should include embedded CSS for styling inside a <style> tag. Ensure the design is modern, aesthetically pleasing, and directly reflects the user's request. Provide a relevant color palette and font pairing. Use Google Fonts for any custom fonts.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        siteName: { type: Type.STRING },
                        colorPalette: {
                            type: Type.OBJECT,
                            properties: {
                                primary: { type: Type.STRING, description: "Hex code, e.g., #FFFFFF" },
                                secondary: { type: Type.STRING, description: "Hex code, e.g., #000000" },
                                accent: { type: Type.STRING, description: "Hex code, e.g., #FF00FF" },
                            },
                            required: ['primary', 'secondary', 'accent']
                        },
                        fontPairing: {
                            type: Type.OBJECT,
                            properties: {
                                heading: { type: Type.STRING, description: "e.g., 'Poppins', sans-serif" },
                                body: { type: Type.STRING, description: "e.g., 'Lato', sans-serif" },
                            },
                             required: ['heading', 'body']
                        },
                        htmlStructure: { type: Type.STRING, description: "A complete, single-file HTML structure with embedded CSS." }
                    },
                     required: ['siteName', 'colorPalette', 'fontPairing', 'htmlStructure']
                }
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateLearningPlan = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                systemInstruction: "You are an expert curriculum designer and teacher. Based on the user's request, create a structured, comprehensive learning plan or knowledge base outline. Break the topic down into logical modules, and for each module, provide key sub-topics to cover.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planTitle: { type: Type.STRING, description: "A concise title for the learning plan." },
                        planDescription: { type: Type.STRING, description: "A brief, one-sentence summary of the learning plan's goal." },
                        modules: {
                            type: Type.ARRAY,
                            description: "An array of learning modules.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "The title of the module." },
                                    description: { type: Type.STRING, description: "A short description of what is covered in this module." },
                                    subTopics: {
                                        type: Type.ARRAY,
                                        description: "A list of key sub-topics or concepts to learn within this module.",
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ['title', 'description', 'subTopics']
                            }
                        }
                    },
                    required: ['planTitle', 'planDescription', 'modules']
                }
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateYouTubeMetadata = async (prompt: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The video was generated from this prompt: "${prompt}"`,
            config: {
                systemInstruction: "You are a YouTube content expert specializing in viral content. Based on the user's video prompt, generate a catchy, SEO-friendly title, a detailed and engaging description that includes a call-to-action, and a list of 10-15 highly relevant tags.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "A short, catchy, and SEO-optimized title for the YouTube video (max 70 characters)."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A detailed and engaging YouTube description. Include a summary, key moments (if applicable), and a call to action to like, comment, and subscribe."
                        },
                        tags: {
                            type: Type.ARRAY,
                            description: "An array of 10-15 relevant keywords and phrases for YouTube tags.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['title', 'description', 'tags']
                }
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generateSocialMediaPost = async (prompt: string, platform: SocialPlatform): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: `You are a social media marketing expert. Write an engaging post for ${platform} based on the user's prompt. Include relevant hashtags and emojis. Tailor the length and tone appropriately for the platform.`
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const findTrendingYouTubeTopics = async (topic: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the latest web results, list 5 viral or trending YouTube video ideas about "${topic}". For each idea, provide a catchy title and a brief one-sentence concept. Format the entire response as a single JSON object with a key "ideas" which is an array of objects, where each object has a "title" and "concept" key.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const generatePresentationOutline = async (topic: string): Promise<GenerateContentResponse> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Generate a complete presentation outline for the topic: "${topic}". Include a main title and at least 5 slides, each with a title and 3-4 bullet points.`,
            config: {
                systemInstruction: "You are an expert presentation creator. Your goal is to generate clear, concise, and well-structured presentation outlines in JSON format.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        mainTitle: { type: Type.STRING, description: "The main title of the presentation." },
                        slides: {
                            type: Type.ARRAY,
                            description: "An array of presentation slides.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "The title of the slide." },
                                    points: {
                                        type: Type.ARRAY,
                                        description: "A list of bullet points for the slide content.",
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ['title', 'points']
                            }
                        }
                    },
                    required: ['mainTitle', 'slides']
                }
            }
        });
        return response;
    } catch (error) {
        throw handleApiError(error);
    }
};