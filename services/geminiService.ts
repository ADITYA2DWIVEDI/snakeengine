import { GoogleGenAI, Part, Chat, GenerateContentResponse, Operation, GenerateVideosResponse, GenerateVideosConfig, LiveSession, LiveServerMessage, Modality, Blob } from "@google/genai";

// Fix: The original global declaration for window.aistudio used an anonymous type,
// which conflicted with an existing declaration that expected the named type 'AIStudio'.
// This has been updated to define and use the 'AIStudio' interface to resolve the conflict.
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    interface Window {
        // Fix: Made `aistudio` optional to resolve declaration conflict about modifiers.
        aistudio?: AIStudio;
    }
}

const getApiKey = (): string => {
    // Prioritize user-provided key from localStorage.
    const userKey = localStorage.getItem('gemini_api_key');
    // Fallback to the environment variable.
    return userKey || process.env.API_KEY || ''; 
};

const getAi = () => new GoogleGenAI({ apiKey: getApiKey() });

// A simple in-memory store for chat sessions
const chatSessions: Map<string, Chat> = new Map();

export function getChat(conversationId: string, model: string = 'gemini-2.5-flash', persona?: string): Chat {
    const session = chatSessions.get(conversationId);

    // Conditions to invalidate the session:
    // 1. No session exists.
    // 2. The existing session's model doesn't match the requested model.
    // 3. The existing session's persona doesn't match the requested persona.
    const isInvalid = !session || session.model !== `models/${model}` || session.config.systemInstruction !== persona;
    
    if (isInvalid) {
        console.log(`Creating/Updating chat session for ${conversationId} with model ${model}`);
        const ai = getAi();
        const config = persona ? { systemInstruction: persona } : {};
        const newSession = ai.chats.create({ 
            model: model,
            config
        });
        chatSessions.set(conversationId, newSession);
        return newSession;
    }

    return session;
}

export function clearChatSession(conversationId: string) {
    chatSessions.delete(conversationId);
}

export async function sendMessage(conversationId: string, userMessageText: string, imageParts: Part[], persona?: string, model: string = 'gemini-2.5-flash') {
    const chat = getChat(conversationId, model, persona);
    const parts = [...imageParts, { text: userMessageText }];
    // Fix: The `chat.sendMessageStream` method expects an object with a `message` property
    // that contains the array of Parts. The previous implementation used a `contents`
    // property, which is incorrect for the Chat API and caused the "ContentUnion is required" error.
    return chat.sendMessageStream({ message: parts });
}

export function fileToGenerativePart(file: File): Promise<Part> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Data = (reader.result as string).split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
}

export async function generateTitleForConversation(userMessage: string, aiResponse: string): Promise<string> {
    try {
        const ai = getAi();
        const prompt = `Generate a short, concise title (4 words max) for the following conversation:\n\nUSER: "${userMessage}"\nAI: "${aiResponse}"`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.replace(/"/g, '').trim();
    } catch (error) {
        console.error("Error generating title:", error);
        return "SnakeEngine.AI";
    }
}

export async function generateImage(prompt: string): Promise<string> {
    const ai = getAi();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
}

interface VideoGenerationParams {
    prompt: string;
    aspectRatio: '16:9' | '9:16';
    length: number;
    style: string;
    image?: Part;
}

export async function generateVideo(
    { prompt, aspectRatio, length, style, image }: VideoGenerationParams,
    onPoll: (op: Operation<GenerateVideosResponse>) => void
): Promise<string> {
    const ai = getAi();

    const fullPrompt = `${prompt}, ${style} style, ${length} seconds long`;
    
    const generateConfig: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: fullPrompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio,
        }
    };

    if (image && image.inlineData) {
        generateConfig.image = {
            imageBytes: image.inlineData.data,
            mimeType: image.inlineData.mimeType
        };
    }

    let operation = await ai.models.generateVideos(generateConfig);

    while (!operation.done) {
        onPoll(operation);
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation succeeded but no download link was found.");
    }
    
    const apiKey = getApiKey();
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
}

export async function checkApiKey(): Promise<boolean> {
    if (window.aistudio) {
        return await window.aistudio.hasSelectedApiKey();
    }
    return true; // Fallback if aistudio is not available, assume key exists
}

export async function openApiKeyDialog(): Promise<void> {
    if (window.aistudio) {
        await window.aistudio.openSelectKey();
    }
}

const generateText = async (model: string, prompt: string, systemInstruction?: string): Promise<string> => {
    try {
        const ai = getAi();
        const config = systemInstruction ? { systemInstruction } : {};
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config,
        });
        return response.text;
    } catch (error) {
        console.error(`Error with model ${model}:`, error);
        throw error;
    }
}

// Generic function for new placeholder tools
export const runAiTool = (systemInstruction: string, userPrompt: string) => generateText('gemini-2.5-pro', userPrompt, systemInstruction);


export const processAudio = (prompt: string) => generateText('gemini-2.5-flash', `Pretend you are an audio processing AI. The user's request is: "${prompt}". Respond as if you analyzed an audio file.`);
export const generateCode = (prompt: string) => generateText('gemini-2.5-pro', prompt);
export const analyzeDocument = (question: string, documentText: string) => generateText('gemini-2.5-pro', `Based on the following document, answer the user's question.\n\nDOCUMENT:\n"""\n${documentText}\n"""\n\nQUESTION: ${question}`);
export const composeMusic = (prompt: string) => generateText('gemini-2.5-flash', `Compose music based on this prompt: "${prompt}". Respond with musical notation.`);

export async function groundedSearch(query: string, location: { latitude: number, longitude: number } | null): Promise<GenerateContentResponse> {
    const ai = getAi();

    const tools: any[] = [{ googleSearch: {} }];
    let toolConfig: any = {};

    if (location) {
        tools.push({ googleMaps: {} });
        toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                }
            }
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools,
                ...(Object.keys(toolConfig).length > 0 && { toolConfig }),
            },
        });
        return response;
    } catch (error) {
        console.error("Error performing grounded search:", error);
        throw error;
    }
}

// Old Features Services (some will be deprecated by new ones)
export const generateIdeas = (topic: string) => generateText('gemini-2.5-pro', topic, 'You are a world-class brainstorming assistant. Given a topic, generate a structured list of related ideas, sub-points, and creative angles. Use Markdown for formatting.');
export const translateText = (text: string, sourceLang: string, targetLang: string) => generateText('gemini-2.5-flash', `Translate the following text from ${sourceLang} to ${targetLang}:\n\n"${text}"`);
export const generateGameConcept = (idea: string) => generateText('gemini-2.5-pro', idea, 'You are a creative game designer. Flesh out the user\'s game idea into a full concept. Include details on gameplay mechanics, story, character ideas, and unique selling points.');

// Pro Tools Services
export const analyzeFinancialData = (query: string) => generateText('gemini-2.5-pro', query, 'You are an expert financial analyst. Provide detailed, insightful, and balanced analysis based on the user\'s query. Do not provide financial advice.');
export const getHealthAdvice = (query: string) => generateText('gemini-2.5-flash', query, 'You are an AI health and wellness advisor. Provide helpful, general information. You must strongly state that you are not a medical professional and the user should consult a doctor for any health concerns.');
export const getStyleAdvice = (query: string) => generateText('gemini-2.5-flash', query, 'You are a friendly and knowledgeable personal stylist. Provide fashion advice and outfit suggestions based on the user\'s request.');

// Fix: Add missing service functions for various tool views.
export const writeContent = (prompt: string) => runAiTool('You are a professional content writer and editor. Generate a complete, well-structured, and engaging piece of long-form content. Use Markdown for formatting.', prompt);
export const generateWebsiteCopy = (description: string) => runAiTool('You are an expert web copywriter and UI/UX designer. Based on the user\'s description, generate compelling website copy and a logical content structure. Use Markdown. The output should include a headline, sub-headline, sections for features/services, about us, and a call-to-action.', description);
export const generatePresentationOutline = (topic: string) => runAiTool('You are a professional presentation designer and public speaking coach. Create a structured and engaging presentation outline based on the user\'s topic. Use Markdown. The outline should include a title slide, introduction, several key point slides with sub-bullets, and a concluding slide with a call to action or summary.', topic);
export const generateEmailDraft = (prompt: string) => runAiTool('You are a professional communications assistant. Write a clear, concise, and effective email based on the user\'s prompt. Ensure the tone is appropriate for the context provided. Structure it with a subject line and body. Use Markdown for formatting.', prompt);
export const generateSocialMediaPlan = (topic: string) => runAiTool('You are a social media marketing expert. Create a one-week social media content calendar based on the user\'s topic or brand. Use Markdown. For each day, provide a post idea, a caption, and relevant hashtags for at least two platforms (e.g., Instagram, Twitter).', topic);
export const generateTravelItinerary = (details: string) => runAiTool('You are an expert travel agent. Create a detailed, day-by-day travel itinerary based on the user\'s destination, duration, and interests. Use Markdown. Include suggestions for activities, restaurants, and transportation for each day.', details);

// --- NEW FULLY IMPLEMENTED FEATURES ---

// CREATE
export const generateBlogPost = (topic: string) => runAiTool('You are an expert blog post writer and SEO specialist. Generate a complete, well-structured, and engaging blog post on the given topic. Use Markdown for formatting, including a compelling title (H1), an introduction, several subheadings (H2), and a concluding paragraph. Ensure the content is informative and easy to read.', topic);
export const generateSeoKeywords = (topic: string) => runAiTool('You are an expert SEO analyst. For the given topic, generate a comprehensive list of SEO keywords. Use Markdown. Structure the response into three sections: 1. Primary Keywords (a short list of the most important keywords). 2. Secondary Keywords (a longer list of related terms). 3. LSI Keywords & User Questions (long-tail keywords and common questions users might ask).', topic);

// BUSINESS
export const generateBusinessPlan = (idea: string) => runAiTool('You are a professional business consultant and strategist. Create a comprehensive, one-page business plan based on the user\'s idea. Use Markdown for clear formatting. The plan must include the following sections: Executive Summary, Company Description, Market Analysis (including target audience), Organization & Management, Products or Services, Marketing & Sales Strategy, and a brief Financial Projections summary.', idea);

// EDUCATION
export const generateLessonPlan = (details: string) => runAiTool('You are an experienced educator and curriculum designer. Create a detailed lesson plan based on the user\'s request. Use Markdown. The plan should include: Learning Objectives, Materials Needed, a step-by-step Activity Procedure (including introduction, main activity, and conclusion/wrap-up), and an Assessment method. The user will provide the topic, subject, and grade level.', details);

// LIFESTYLE
export const generateRecipe = (details: string) => runAiTool('You are a creative and experienced chef. Based on the ingredients and preferences provided by the user, create a unique and delicious recipe. Use Markdown. Give the recipe a catchy name. List all necessary ingredients (including quantities), provide clear step-by-step instructions, and estimate the prep and cook time. If some key ingredients seem to be missing, you can suggest them as optional additions.', `Generate a recipe with these details: ${details}`);
export const generateWorkout = (details: string) => runAiTool('You are a certified personal trainer. Create a personalized workout plan based on the user\'s details and goals. Use Markdown. The plan should include a Warm-Up section, the main Workout section (listing exercises with sets, reps, and rest times), and a Cool-Down section. You must include a disclaimer stating that the user should consult with a healthcare professional before starting any new fitness program.', details);

// Live Conversation Service
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const liveSessionManager = {
    connect: (onMessage: (message: LiveServerMessage) => void, onError: (e: ErrorEvent) => void, onClose: (e: CloseEvent) => void, onOpen: () => void): Promise<LiveSession> => {
        const ai = getAi();
        return ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: onOpen,
                onmessage: onMessage,
                onerror: onError,
                onclose: onClose,
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                inputAudioTranscription: {},
                outputAudioTranscription: {},
                systemInstruction: 'You are a friendly and helpful AI assistant from SnakeEngine.AI.',
            },
        });
    }
};