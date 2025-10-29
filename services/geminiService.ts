// FIX: Removed LiveSession, CloseEvent, ErrorEvent from import as they are not exported from @google/genai.
import { GoogleGenAI, Modality, LiveServerMessage, Blob, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
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

export const generateChatResponse = async (history: Message[], systemInstruction?: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API client not available. Please configure your API Key.";

    try {
        const contents = history.map(item => ({
            role: item.sender === 'ai' ? 'model' as const : 'user' as const,
            parts: [{ text: item.text }],
        }));
        
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

// FIX: Changed return type from Promise<LiveSession> to Promise<any> as LiveSession is not an exported type.
// ErrorEvent and CloseEvent are global types and don't need to be imported from @google/genai.
export const connectLiveChat = (callbacks: { onopen: () => void; onmessage: (message: LiveServerMessage) => Promise<void>; onerror: (e: ErrorEvent) => void; onclose: (e: CloseEvent) => void; }): Promise<any> => {
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

export const askAboutUs = async (question: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "API client not available. Please configure your API Key.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
                systemInstruction: `You are an AI spokesperson for SnakeEngine.AI, a project created by Aditya Dwivedi and Rashish Singh. Your mission is to answer questions about the project based *only* on the information provided below.

### About SnakeEngine.AI
- **Project Name:** SnakeEngine.ai
- **Welcome Message:** Welcome to SnakeEngine.ai, your all-in-one platform for smarter work, powered by advanced artificial intelligence.
- **Our Story:** SnakeEngine.ai was born out of a passion for making powerful, modern AI tools accessible to everyone. We bring together cutting-edge technology and intuitive design to help creators, teams, and businesses solve real problems and work smarter.
- **Our Vision:** To become the world’s leading AI productivity and creativity hub, making innovation simple across every screen, device, and workflow.
- **What We Offer:**
    - AI Chat & Assistant: Talk to the smartest AI, get instant help, answers, and automate routine tasks.
    - Smart Studio: Edit, create, and enhance images, documents, and presentations with over 200 dynamic AI tools.
    - Pro Analytics: Visualize data instantly with interactive charts and real-time insights.
    - Workflow Automation: Drag-and-drop builder to automate your daily work and connect all your favorite apps.
    - Voice & Video AI: Speak, transcribe, translate, and get automated summaries for meetings and calls.
    - Cross-Device Sync: Start on your PC, continue on mobile or tablet—your data follows you everywhere.
    - Secure & Private: Advanced security ensures your data is safe and private at all times.
- **Meet the Team:** SnakeEngine.ai is built by a passionate group of engineers, designers, and AI experts. Our diverse backgrounds help us deliver unique solutions trusted by creators and businesses worldwide. The co-creators are Aditya Dwivedi and Rashish Singh.
- **Join the Community:** We invite users to become part of our fast-growing community for user stories, early access to new features, and direct support.
- **Contact:** Email at snakeengineofficial@gmail.com or connect on social media @SNAKEENGINEOFFICIAL.
- **Call to Action:** Let’s Build the Future Together. Try it free, share feedback, and grow with us!

- **Tone:** Be friendly, professional, and enthusiastic. Answer from the perspective of the creators' spokesperson. If a question is outside this context, politely state that you can only answer questions about the SnakeEngine.AI project.`,
            },
        });

        return response.text;
    } catch (error) {
        return handleApiError(error, "About Us Assistant");
    }
};

// --- DEDICATED PLUGIN FUNCTIONS ---

export const draftEmail = async (to: string, subject: string, prompt: string) => {
    const ai = getAiClient();
    if (!ai) return { email: null, error: "API client not available. Please configure your API Key." };

    try {
        const fullPrompt = `As a helpful assistant, draft a professional and clear email based on the user's request.
To: ${to}
Subject: ${subject}
Core message/prompt: "${prompt}"

Return a JSON object with "subject" and "body" fields. The body should be well-formatted text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING },
                    },
                    required: ["subject", "body"],
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return { email: jsonResponse, error: null };
    } catch (error) {
        return { email: null, error: handleApiError(error, "Gmail Tool") };
    }
};

export const createCalendarEventDetails = async (prompt: string) => {
    const ai = getAiClient();
    if (!ai) return { event: null, error: "API client not available. Please configure your API Key." };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Based on the following prompt, generate details for a calendar event. Create a concise, descriptive title, a detailed description for the event body, and a list of potential attendees based on the context (just their names).
Prompt: "${prompt}"

Return a JSON object with "title", "description", and "attendees" (an array of strings) fields.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        attendees: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ["title", "description", "attendees"],
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return { event: jsonResponse, error: null };
    } catch (error) {
        return { event: null, error: handleApiError(error, "Google Calendar Tool") };
    }
};

export const draftSlackMessage = async (prompt: string) => {
    const ai = getAiClient();
    if (!ai) return { message: null, error: "API client not available. Please configure your API Key." };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Act as a communications expert. Draft a concise and professional Slack message based on the following prompt. Use Slack's Markdown formatting (like *bold*, _italics_, and code blocks) where appropriate to improve readability.
Prompt: "${prompt}"`,
        });
        return { message: response.text, error: null };
    } catch (error) {
        return { message: null, error: handleApiError(error, "Slack Tool") };
    }
};

export const generateNotionContent = async (prompt: string) => {
    const ai = getAiClient();
    if (!ai) return { content: null, error: "API client not available. Please configure your API Key." };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Generate structured content suitable for a Notion page based on this prompt. Use Markdown for formatting (headings, lists, bullet points, tables, etc.) to create a well-organized document.
Prompt: "${prompt}"`,
        });
        return { content: response.text, error: null };
    } catch (error) {
        return { content: null, error: handleApiError(error, "Notion Tool") };
    }
};

export const generateFigmaIdeas = async (prompt: string) => {
    const ai = getAiClient();
    if (!ai) return { ideas: null, error: "API client not available. Please configure your API Key." };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Act as a senior UI/UX designer. Brainstorm and describe detailed design ideas and suggestions for a Figma component or screen based on the following prompt. Provide details on layout, typography, color palette, key elements, and potential user interactions. Format your response as well-structured Markdown.
Prompt: "${prompt}"`,
        });
        return { ideas: response.text, error: null };
    } catch (error) {
        return { ideas: null, error: handleApiError(error, "Figma Tool") };
    }
};

export const generateGitHubText = async (diff: string, textType: 'Commit Message' | 'PR Description') => {
    const ai = getAiClient();
    if (!ai) return { text: null, error: "API client not available. Please configure your API Key." };

    let promptText = '';
    if (textType === 'Commit Message') {
        promptText = `Generate a concise and conventional commit message (e.g., "feat: Add user authentication") based on the following git diff.
Diff:
\`\`\`diff
${diff}
\`\`\``
    } else {
        promptText = `Generate a detailed pull request description based on the following git diff. Include a title, a summary of changes, and potential testing steps. Use Markdown for formatting.
Diff:
\`\`\`diff
${diff}
\`\`\``
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: promptText,
        });
        return { text: response.text, error: null };
    } catch (error) {
        return { text: null, error: handleApiError(error, "GitHub Tool") };
    }
};
