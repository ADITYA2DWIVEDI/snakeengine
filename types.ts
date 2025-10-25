

export enum Page {
    HOME = "Home",
    SMART_STUDIO = "Smart Studio",
    COURSES = "Courses",
    SETTINGS = "Settings",
    PLANS_SUBSCRIPTIONS = "Plans & Subscription",
    HELP_SUPPORT = "Help & Support",
    WHATS_NEW = "What's New",
    
    // These are not primary pages anymore but might be used internally
    DISCOVER = "Discover",
    YOUR_SPACE = "Your Space",
    TEMPLATES = "Templates",
    CREATORS = "Creators",
    TUTORIAL = "Tutorial",
    ADMIN = "Admin",
    API_KEYS = "API Keys",
    SNAKE_ENGINE = "SnakeEngine",
    BUILD_EVERYTHING = "Build Everything",
}

export enum Feature {
    // AI Platform Features
    SMART_CHAT = "Smart Chat",
    LIVE_CHAT = "Live Chat",
    IMAGE_GENERATION = "Image Generation",
    IMAGE_EDITING = "Image Editing",
    VIDEO_GENERATION = "Video Generation",
    FILE_ANALYSIS = "Image Analysis",
    VIDEO_ANALYSIS = "Video Analysis",
    THINKING_MODE = "Thinking Mode",
    AUDIO_TRANSCRIPTION = "Audio Transcription",
    LIVE_VOICE = "Live Voice",
    
    // Creator Tools
    YOUTUBE_STUDIO = "YouTube Studio",
    SOCIAL_PLANNER = "Social Planner",
    STORYBOARD_CREATOR = "Storyboard Creator",
    PRESENTATION_GENERATOR = "Presentation Generator",

    // Pro Tools
    APP_BUILDER = "App Builder",
    WEBSITE_BUILDER = "Website Builder",
    EXCEL_AUTOMATION = "Excel Automation",
    EXCEL_NUMBER_TO_WORDS = "Number to Words",
    EXCEL_PDF_EXTRACTOR = "PDF Extractor",
    AI_SEARCH = "AI Search",
    PROMPT_ENGINEERING = "Prompt Engineering",
    CODE_CONVERTER = "Code Converter",
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    sources?: GroundingSource[];
    image?: string; 
    video?: string;
}

export type FontStyle = 'Inter' | 'Roboto' | 'Poppins' | 'Source Code Pro';
export type DesignDensity = 'Compact' | 'Comfortable' | 'Spacious';

export type AIPersonality = 'Assistant' | 'Creative' | 'Professional' | 'Concise';

export interface Course {
  id: number;
  title: string;
  type: 'free' | 'paid';
  price: number;
  youtube_url: string;
  description: string;
  duration: string;
  tags: string[];
}

export type SocialPlatform = 'Instagram' | 'Facebook' | 'Twitter' | 'LinkedIn';

export interface ScheduledPost {
    id: string;
    platform: SocialPlatform;
    content: string;
    scheduledAt: Date;
    imageUrl?: string;
}

export type ApiProvider = 'Google' | 'OpenAI' | 'Anthropic' | 'Perplexity' | 'DeepSeek' | 'Grok' | 'Default';

export interface ApiKey {
    id: string;
    nickname: string;
    provider: ApiProvider;
    key: string;
}

export interface Presentation {
    mainTitle: string;
    slides: {
        title: string;
        points: string[];
    }[];
}