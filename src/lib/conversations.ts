import type { Message } from '@/types';
import type { Conversation, ConversationMeta } from '@/types/conversation';

const INDEX_KEY = 'hormozi-conversations-index';
const CONVERSATION_PREFIX = 'hormozi-conversation-';
const MAX_CONVERSATIONS = 50;

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Get preview text from first user message
function getPreview(messages: Message[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (!firstUserMessage) return 'New conversation';
  return firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '');
}

// Get title from first user message
function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (!firstUserMessage) return 'New Conversation';
  // Take first 40 characters of the first sentence
  const firstSentence = firstUserMessage.content.split(/[.!?\n]/)[0];
  return firstSentence.substring(0, 40) + (firstSentence.length > 40 ? '...' : '');
}

// Get conversation list (metadata only)
export function getConversationList(): ConversationMeta[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(INDEX_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Get full conversation by ID
export function getConversation(id: string): Conversation | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(CONVERSATION_PREFIX + id);
  if (!data) return null;
  try {
    const conv = JSON.parse(data);
    // Reconstruct Date objects for messages
    conv.messages = conv.messages.map((m: Message & { timestamp: string | Date }) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    return conv;
  } catch {
    return null;
  }
}

// Save conversation (creates or updates)
export function saveConversation(conv: Conversation): void {
  if (typeof window === 'undefined') return;

  // Update timestamp
  conv.updatedAt = Date.now();

  // Auto-generate title if still default and has messages
  if (conv.title === 'New Conversation' && conv.messages.length > 0) {
    conv.title = generateTitle(conv.messages);
  }

  // Save full conversation
  localStorage.setItem(CONVERSATION_PREFIX + conv.id, JSON.stringify(conv));

  // Update index
  const list = getConversationList();
  const meta: ConversationMeta = {
    id: conv.id,
    title: conv.title,
    industry: conv.industry,
    messageCount: conv.messages.length,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
    preview: getPreview(conv.messages),
  };

  const existingIndex = list.findIndex((c) => c.id === conv.id);
  if (existingIndex >= 0) {
    list[existingIndex] = meta;
  } else {
    list.unshift(meta);
  }

  // Sort by updatedAt descending
  list.sort((a, b) => b.updatedAt - a.updatedAt);

  // Enforce limit
  if (list.length > MAX_CONVERSATIONS) {
    const removed = list.splice(MAX_CONVERSATIONS);
    removed.forEach((c) => localStorage.removeItem(CONVERSATION_PREFIX + c.id));
  }

  localStorage.setItem(INDEX_KEY, JSON.stringify(list));
}

// Delete conversation
export function deleteConversation(id: string): void {
  if (typeof window === 'undefined') return;

  // Remove conversation data
  localStorage.removeItem(CONVERSATION_PREFIX + id);

  // Update index
  const list = getConversationList().filter((c) => c.id !== id);
  localStorage.setItem(INDEX_KEY, JSON.stringify(list));
}

// Create new empty conversation
export function createConversation(industry: string | null = null): Conversation {
  const now = Date.now();
  return {
    id: generateId(),
    title: 'New Conversation',
    industry,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

// Update conversation title
export function updateConversationTitle(id: string, title: string): void {
  const conv = getConversation(id);
  if (!conv) return;
  conv.title = title;
  saveConversation(conv);
}

// Get most recent conversation or create new one
export function getOrCreateCurrentConversation(): Conversation {
  const list = getConversationList();
  if (list.length > 0) {
    const mostRecent = getConversation(list[0].id);
    if (mostRecent) return mostRecent;
  }
  return createConversation();
}

// Migrate old localStorage format (one-time)
export function migrateOldConversation(): void {
  if (typeof window === 'undefined') return;

  const OLD_MESSAGES_KEY = 'hormozi-advisor-chat';
  const OLD_INDUSTRY_KEY = 'hormozi-advisor-industry';
  const MIGRATION_KEY = 'hormozi-migration-done';

  // Check if already migrated
  if (localStorage.getItem(MIGRATION_KEY)) return;

  const oldMessages = localStorage.getItem(OLD_MESSAGES_KEY);
  const oldIndustry = localStorage.getItem(OLD_INDUSTRY_KEY);

  if (oldMessages) {
    try {
      const messages = JSON.parse(oldMessages);
      if (messages.length > 0) {
        // Create a new conversation with old data
        const conv = createConversation(oldIndustry);
        conv.messages = messages.map((m: Message & { timestamp: string | Date }) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        conv.title = generateTitle(conv.messages);
        saveConversation(conv);
      }
    } catch {
      // Ignore migration errors
    }
  }

  // Mark as migrated
  localStorage.setItem(MIGRATION_KEY, 'true');
}
