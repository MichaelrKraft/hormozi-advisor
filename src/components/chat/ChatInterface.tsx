'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types';
import type { Conversation, ConversationMeta } from '@/types/conversation';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import ConversationList from './ConversationList';
import {
  getConversationList,
  getConversation,
  saveConversation,
  deleteConversation,
  createConversation,
  getOrCreateCurrentConversation,
  migrateOldConversation,
} from '@/lib/conversations';

const INDUSTRIES = [
  'SaaS / Software',
  'E-commerce / Retail',
  'Coaching / Consulting',
  'Agency / Services',
  'Health / Fitness',
  'Finance / Fintech',
  'Education / Courses',
  'Real Estate',
  'Local Business',
  'B2B Services',
  'Creator / Influencer',
  'Other',
];

export default function ChatInterface() {
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversationList, setConversationList] = useState<ConversationMeta[]>([]);
  const [showConversationList, setShowConversationList] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize conversation system on mount
  useEffect(() => {
    // Migrate old localStorage format (one-time)
    migrateOldConversation();

    // Load most recent conversation or create new one
    const conv = getOrCreateCurrentConversation();
    setCurrentConversation(conv);
    setMessages(conv.messages);
    setIndustry(conv.industry);

    // Load conversation list
    setConversationList(getConversationList());
  }, []);

  // Auto-save conversation when messages change
  useEffect(() => {
    if (currentConversation && messages.length > 0) {
      const updatedConv: Conversation = {
        ...currentConversation,
        messages,
        industry,
        updatedAt: Date.now(),
      };
      saveConversation(updatedConv);
      // Update list to reflect new title/preview
      setConversationList(getConversationList());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Save industry changes separately
  useEffect(() => {
    if (currentConversation && industry !== currentConversation.industry) {
      const updatedConv: Conversation = {
        ...currentConversation,
        industry,
        updatedAt: Date.now(),
      };
      saveConversation(updatedConv);
      setCurrentConversation(updatedConv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry]);

  // Scroll to bottom when messages or streaming content change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Handle selecting a conversation from the list
  const handleSelectConversation = useCallback((id: string) => {
    const conv = getConversation(id);
    if (conv) {
      setCurrentConversation(conv);
      setMessages(conv.messages);
      setIndustry(conv.industry);
    }
  }, []);

  // Handle creating a new conversation
  const handleNewConversation = useCallback(() => {
    const conv = createConversation(industry);
    saveConversation(conv);
    setCurrentConversation(conv);
    setMessages([]);
    setConversationList(getConversationList());
  }, [industry]);

  // Handle deleting a conversation
  const handleDeleteConversation = useCallback((id: string) => {
    deleteConversation(id);
    const list = getConversationList();
    setConversationList(list);

    // If we deleted the current conversation, switch to another or create new
    if (currentConversation?.id === id) {
      if (list.length > 0) {
        const nextConv = getConversation(list[0].id);
        if (nextConv) {
          setCurrentConversation(nextConv);
          setMessages(nextConv.messages);
          setIndustry(nextConv.industry);
          return;
        }
      }
      // No conversations left, create a new one
      const newConv = createConversation();
      saveConversation(newConv);
      setCurrentConversation(newConv);
      setMessages([]);
      setConversationList(getConversationList());
    }
  }, [currentConversation]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      // Prepare messages for API (without ids and timestamps)
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, industry }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamingContent(fullContent);
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent('');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Look, something went wrong on my end. That's on me. Try again - we've got work to do.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleIndustrySelect = (selectedIndustry: string) => {
    setIndustry(selectedIndustry);
    setShowIndustrySelector(false);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Industry Selector Modal */}
      {showIndustrySelector && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Select Your Industry</h3>
            <p className="text-zinc-400 text-sm mb-4">
              This helps me tailor advice with relevant examples from your space.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => handleIndustrySelect(ind)}
                  className="px-4 py-3 text-sm font-medium text-zinc-200 bg-zinc-700 rounded-lg hover:bg-sky-600/20 hover:text-sky-400 hover:border-sky-600/50 border border-zinc-600 transition-colors text-left"
                >
                  {ind}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowIndustrySelector(false)}
              className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-300"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* Header with conversation selector, industry badge and controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900 relative">
        <div className="flex items-center gap-2">
          {/* Conversations dropdown button */}
          <button
            onClick={() => setShowConversationList(!showConversationList)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="max-w-[150px] truncate">
              {currentConversation?.title || 'Chats'}
            </span>
            <span className="text-zinc-500 text-xs">
              ({conversationList.length})
            </span>
          </button>

          {/* Conversation List Dropdown */}
          <ConversationList
            conversations={conversationList}
            currentId={currentConversation?.id || null}
            onSelect={handleSelectConversation}
            onNew={handleNewConversation}
            onDelete={handleDeleteConversation}
            isOpen={showConversationList}
            onClose={() => setShowConversationList(false)}
          />

          {industry && (
            <button
              onClick={() => setShowIndustrySelector(true)}
              className="px-3 py-1 text-xs font-medium text-sky-400 bg-sky-900/30 border border-sky-600/30 rounded-full hover:bg-sky-900/50 transition-colors"
            >
              {industry} ✎
            </button>
          )}
          {!industry && (
            <button
              onClick={() => setShowIndustrySelector(true)}
              className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full hover:border-zinc-600 transition-colors"
            >
              + Set Industry
            </button>
          )}
        </div>
        {/* New Chat button */}
        <button
          onClick={handleNewConversation}
          className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
        >
          <span>+</span> New Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 -mt-20">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Talk to <span className="text-sky-400">Alex Hormozi</span>
            </h2>
            <p className="text-zinc-400 max-w-md mb-4">
              Get business advice using the frameworks from $100M Offers and $100M Leads.
              Ask about offers, pricing, leads, LTV/CAC, or anything business.
            </p>
            {!industry && (
              <button
                onClick={() => setShowIndustrySelector(true)}
                className="mb-4 px-4 py-2 text-sm font-medium text-sky-400 border border-sky-600/50 rounded-lg hover:bg-sky-900/30 transition-colors"
              >
                Select Your Industry for Personalized Advice
              </button>
            )}
            <QuickActions onSelect={sendMessage} disabled={isLoading} />
            {/* Input Area - Centered in welcome state */}
            <div className="w-full max-w-2xl mt-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about offers, leads, pricing, LTV/CAC, or request a playbook..."
                  className="flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[48px] max-h-[200px]"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="self-end px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {/* Streaming content while loading */}
            {isLoading && streamingContent && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%] bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <p className="text-sm text-zinc-100 whitespace-pre-wrap">{streamingContent}</p>
                  <span className="inline-block w-2 h-4 bg-sky-500 animate-pulse ml-1" />
                </div>
              </div>
            )}
            {/* Loading dots when waiting for first chunk */}
            {isLoading && !streamingContent && (
              <div className="flex justify-start mb-4">
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Actions (shown after conversation starts) */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-800">
          <QuickActions onSelect={sendMessage} disabled={isLoading} />
        </div>
      )}

      {/* Input Area - Only show at bottom when conversation has started */}
      {messages.length > 0 && (
        <div className="border-t border-zinc-800 p-4 bg-zinc-900">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about offers, leads, pricing, LTV/CAC, or request a playbook..."
              className="flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[48px] max-h-[200px]"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="self-end px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
