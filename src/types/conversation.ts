import type { Message } from './index';

// Full conversation with all messages
export interface Conversation {
  id: string;
  title: string;
  industry: string | null;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// Lightweight metadata for conversation list
export interface ConversationMeta {
  id: string;
  title: string;
  industry: string | null;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
  preview: string;
}
