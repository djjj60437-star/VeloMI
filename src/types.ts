export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  thinking?: string;
  isThinking?: boolean;
  sources?: Array<{ title: string; url: string }>;
  imageUrl?: string;
  codeSnippet?: {
    code: string;
    language: string;
  };
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  attachedFiles?: Array<{
    name: string;
    type: string;
    size?: number;
    previewUrl?: string;
  }>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
}

export type MainTab = 'chat' | 'work';

export interface CustomGPT {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  prompt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  authProvider: 'google' | 'email';
  isLoggedIn: boolean;
}
