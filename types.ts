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