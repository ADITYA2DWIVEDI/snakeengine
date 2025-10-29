export enum Page {
  Home,
  SmartStudio,
  Courses,
  MyLearning,
  Promo,
  Settings,
  Plans,
  Help,
  StudyPlan,
  CodeReviewer,
  DocumentSummarizer,
  Plugins, // New page for the marketplace
  // REMOVED: PluginAssistant
  GmailTool,
  CalendarTool,
  SlackTool,
  NotionTool,
  FigmaTool,
  GitHubTool,
}

export interface Tab {
  id: string;
  name: string;
  page: Page;
  toolId?: string; // e.g., 'image-generation' or 'gmail'
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  isThinking?: boolean;
  // For plugin assistant
  isConfirmation?: boolean;
  toolCall?: {
    name: string;
    args: any;
    id: string;
  }
}

export interface Chat {
  id: string;
  title?: string;
  messages: Message[];
  systemInstruction?: string; // For custom persona
}

export interface Course {
    id: number;
    title: string;
    description: string;
    tags: string[];
    type: 'free' | 'paid';
    price: number;
    youtube_url: string;
    duration: string;
}

export interface AIRecommendation {
    courseId: number;
    justification: string;
}