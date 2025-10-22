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

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// A simple in-memory store for chat sessions
const chatSessions: Map<string, Chat> = new Map();

export function getChat(conversationId: string, persona?: string): Chat {
    if (!chatSessions.has(conversationId)) {
        const ai = getAi();
        const config = persona ? { systemInstruction: persona } : {};
        chatSessions.set(conversationId, ai.chats.create({ 
            model: 'gemini-2.5-flash',
            config
        }));
    }
    const chat = chatSessions.get(conversationId)!;
    // This is a simplified way to handle persona changes.
    // In a real app, you might want to compare old and new personas.
    if (persona && chat.config.systemInstruction !== persona) {
        clearChatSession(conversationId);
        return getChat(conversationId, persona);
    }
    return chat;
}

export function clearChatSession(conversationId: string) {
    chatSessions.delete(conversationId);
}

export async function sendMessage(conversationId: string, userMessageText: string, imageParts: Part[], persona?: string) {
    const chat = getChat(conversationId, persona);
    const contents = {
        parts: [...imageParts, { text: userMessageText }]
    };
    return chat.sendMessageStream({ contents });
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
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

export const processAudio = (prompt: string) => generateText('gemini-2.5-flash', `Pretend you are an audio processing AI. The user's request is: "${prompt}". Respond as if you analyzed an audio file.`);
export const generateCode = (prompt: string) => generateText('gemini-2.5-pro', prompt);
export const writeContent = (prompt: string) => generateText('gemini-2.5-pro', prompt);
export const analyzeDocument = (question: string, documentText: string) => generateText('gemini-2.5-pro', `Based on the following document, answer the user's question.\n\nDOCUMENT:\n"""\n${documentText}\n"""\n\nQUESTION: ${question}`);
export const composeMusic = (prompt: string) => generateText('gemini-2.5-flash', `Compose music based on this prompt: "${prompt}". Respond with musical notation.`);

// New Features Services
export const generateIdeas = (topic: string) => generateText('gemini-2.5-pro', topic, 'You are a world-class brainstorming assistant. Given a topic, generate a structured list of related ideas, sub-points, and creative angles. Use Markdown for formatting.');
export const translateText = (text: string, sourceLang: string, targetLang: string) => generateText('gemini-2.5-flash', `Translate the following text from ${sourceLang} to ${targetLang}:\n\n"${text}"`);
export const generatePodcastScript = (topic: string) => generateText('gemini-2.5-pro', topic, 'You are a podcast scriptwriter. Generate a detailed script for a podcast episode based on the given topic. Include an intro, segments, and an outro.');
export const generateSocialMediaPlan = (topic: string) => generateText('gemini-2.5-pro', topic, 'You are a social media strategist. Create a one-week content plan for the given topic or brand. Include post ideas, captions, and hashtag suggestions for platforms like Instagram and Twitter.');
export const generateFitnessPlan = (details: string) => generateText('gemini-2.5-flash', details, 'You are a certified personal trainer and nutritionist. Create a personalized one-week diet and fitness plan based on the user\'s details and goals. Include warnings and disclaimers about consulting a doctor.');
export const generateTravelItinerary = (details: string) => generateText('gemini-2.5-pro', details, 'You are an expert travel agent. Create a detailed travel itinerary based on the user\'s destination, duration, and interests. Include suggestions for accommodation, activities, and dining.');
export const generateGameConcept = (idea: string) => generateText('gemini-2.5-pro', idea, 'You are a creative game designer. Flesh out the user\'s game idea into a full concept. Include details on gameplay mechanics, story, character ideas, and unique selling points.');


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
