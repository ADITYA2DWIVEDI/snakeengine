

export enum Page {
    HOME = "Home",
    BUILD_EVERYTHING = "Build Everything",
    COURSES = "Courses",
    SETTINGS = "Settings",
    PLANS_SUBSCRIPTIONS = "Plans & Subscription",
    TOP_MODEL_KEYS = "Top Model API Keys",
    OWNER_ADMINS = "Owner & Admins",
    HELP_SUPPORT = "Help & Support",
    WHATS_NEW = "What's New",
    // Fix: Add missing Page enum members for Discover, Your Space, and Templates views.
    DISCOVER = "Discover",
    YOUR_SPACE = "Your Space",
    TEMPLATES = "Templates",
    // Fix: Add `TUTORIAL` to the Page enum.
    TUTORIAL = "Tutorial",
    AI_BUSINESS = "AI Business",
    LIVE_CHAT_PLATFORM = "Live Chat Platform",
    // Fix: Add missing Page enum members for new views.
    EXCEL_AUTOMATION = "Excel Automation",
    AI_SEARCH = "AI Search",
    PROMPT_ENGINEERING = "Prompt Engineering",
    SNAKE_ENGINE = "Snake Engine",
}

export enum Feature {
    SMART_CHAT = "Smart Chat",
    LIVE_VOICE = "Live Voice",
    IMAGE_GENERATION = "Image Generation",
    IMAGE_EDITING = "Image Editing",
    VIDEO_GENERATION = "Video Generation",
    FILE_ANALYSIS = "File Analysis",
    THINKING_MODE = "Thinking Mode",
    APP_BUILDER = "App Builder",
    WEBSITE_BUILDER = "Website Builder",
    GAME_ASSET_GENERATOR = "Game Asset Generator",
    STORYBOARD_CREATOR = "Storyboard Creator",
    PRESENTATION_GENERATOR = "Presentation Generator",
    LEARNING_PLAN_BUILDER = "Learning Plan Builder",
    YOUTUBE_STUDIO = "YouTube Studio",
    SOCIAL_PLANNER = "Social Planner",
    EXCEL_NUMBER_TO_WORDS = "Number to Words",
    EXCEL_PDF_EXTRACTOR = "PDF Data Extractor",
    AI_MUSIC_GENERATOR = "AI Music Generator",
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
    image?: string; // for image previews in chat
    video?: string; // for video previews in chat
}

export type SocialPlatform = 'Instagram' | 'Facebook' | 'Twitter' | 'LinkedIn';

export interface ScheduledPost {
    id: string;
    platform: SocialPlatform;
    content: string;
    imageUrl?: string;
    scheduledAt: Date;
}

export interface Slide {
    title: string;
    points: string[];
}

export interface Presentation {
    mainTitle: string;
    slides: Slide[];
}

export type ApiProvider = 'Google' | 'OpenAI' | 'Perplexity' | 'DeepSeek' | 'Grok' | 'Anthropic';

export interface ApiKey {
    id: string;
    nickname: string;
    provider: ApiProvider;
    key: string;
}

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

export type FontStyle = 'Inter' | 'Roboto' | 'Poppins' | 'Source Code Pro';
export type AIPersonality = 'Assistant' | 'Creative' | 'Professional' | 'Concise';
export type DesignDensity = 'Compact' | 'Comfortable' | 'Spacious';