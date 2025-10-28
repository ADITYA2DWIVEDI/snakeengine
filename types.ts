export enum Page {
  Home,
  SmartStudio,
  Courses,
  Settings,
  Plans,
  Help,
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  isThinking?: boolean;
}
