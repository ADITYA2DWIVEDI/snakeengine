export enum Page {
  Home,
  SmartStudio,
  Courses,
  MyLearning,
  Promo,
  Settings,
  Plans,
  Help,
  AboutUs,
  StudyPlan,
  CodeReviewer,
  DocumentSummarizer,
  Plugins,
  // New dedicated tool pages
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
  toolId?: string; 
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  isThinking?: boolean;
}

export interface Chat {
  id: string;
  title?: string;
  messages: Message[];
  systemInstruction?: string; 
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