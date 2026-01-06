'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Message } from '@/types';
import type { Conversation, ConversationMeta } from '@/types/conversation';
import MessageBubble from './MessageBubble';
import QuickActions from './QuickActions';
import ConversationList from './ConversationList';
import SuggestedQuestions, { parseFollowUps } from './SuggestedQuestions';
import {
  getConversationList,
  getConversation,
  saveConversation,
  deleteConversation,
  createConversation,
  getOrCreateCurrentConversation,
  migrateOldConversation,
  updateConversationTitle,
} from '@/lib/conversations';
import { exportConversationAsMarkdown } from '@/lib/markdown-export';

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

interface WebsiteContext {
  businessName?: string;
  industry?: string;
  tagline?: string;
  products?: Array<string | { name?: string; description?: string; keyFeatures?: string[] }>;
  targetAudience?: string;
  uniqueValue?: string;
  pricing?: string | { model?: string; tiers?: string; prices?: string };
  businessModel?: string;
  summary?: string;
  howItWorks?: string;
  keyBenefits?: string[];
  socialProof?: string;
  currentOffer?: string;
  potentialWeaknesses?: string;
  competitivePosition?: string;
  additionalContext?: string;
}

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
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [websiteContext, setWebsiteContext] = useState<WebsiteContext | null>(null);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
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

  // Track unsaved changes when messages change (but don't auto-save)
  useEffect(() => {
    if (messages.length > 0) {
      // Check if this is a new message (not loaded from storage)
      const savedConv = currentConversation?.id ? getConversation(currentConversation.id) : null;
      if (!savedConv || savedConv.messages.length !== messages.length) {
        setHasUnsavedChanges(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Warn user before closing if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && messages.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved conversation changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, messages.length]);

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
    const doSelectConversation = () => {
      const conv = getConversation(id);
      if (conv) {
        setCurrentConversation(conv);
        setMessages(conv.messages);
        setIndustry(conv.industry);
        setHasUnsavedChanges(false);
      }
    };

    // Check for unsaved changes first
    if (hasUnsavedChanges && messages.length > 0) {
      setPendingAction(() => doSelectConversation);
      setShowUnsavedWarning(true);
    } else {
      doSelectConversation();
    }
  }, [hasUnsavedChanges, messages.length]);

  // Handle creating a new conversation
  const handleNewConversation = useCallback(() => {
    const doNewConversation = () => {
      const conv = createConversation(industry);
      // Don't save empty conversations automatically
      setCurrentConversation(conv);
      setMessages([]);
      setHasUnsavedChanges(false);
    };

    // Check for unsaved changes first
    if (hasUnsavedChanges && messages.length > 0) {
      setPendingAction(() => doNewConversation);
      setShowUnsavedWarning(true);
    } else {
      doNewConversation();
    }
  }, [industry, hasUnsavedChanges, messages.length]);

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

  // Handle renaming a conversation
  const handleRenameConversation = useCallback((id: string, newTitle: string) => {
    updateConversationTitle(id, newTitle);
    setConversationList(getConversationList());
    // Update current conversation if it's the one being renamed
    if (currentConversation?.id === id) {
      setCurrentConversation(prev => prev ? { ...prev, title: newTitle } : null);
    }
  }, [currentConversation]);

  // Handle exporting conversation as markdown
  const handleExportMarkdown = useCallback(() => {
    if (!currentConversation || messages.length === 0) return;
    exportConversationAsMarkdown({
      title: currentConversation.title,
      messages,
      industry,
      createdAt: currentConversation.createdAt,
    });
  }, [currentConversation, messages, industry]);

  // Handle saving the conversation explicitly
  const handleSaveConversation = useCallback(() => {
    if (!currentConversation || messages.length === 0) return;

    const updatedConv: Conversation = {
      ...currentConversation,
      messages,
      industry,
      updatedAt: Date.now(),
    };
    saveConversation(updatedConv);
    setCurrentConversation(updatedConv);
    setConversationList(getConversationList());
    setHasUnsavedChanges(false);
    setShowSaveConfirm(true);

    // Hide confirmation after 2 seconds
    setTimeout(() => setShowSaveConfirm(false), 2000);
  }, [currentConversation, messages, industry]);

  // Handle discarding conversation (start fresh without saving)
  const handleDiscardConversation = useCallback(() => {
    const conv = createConversation(industry);
    // Don't save to storage - just update state
    setCurrentConversation(conv);
    setMessages([]);
    setHasUnsavedChanges(false);
  }, [industry]);

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
    setFollowUps([]); // Clear previous follow-ups

    try {
      // Prepare messages for API (without ids and timestamps)
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          industry,
          websiteContext: websiteContext || undefined,
        }),
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

      // Parse follow-ups from the response
      const { cleanContent, followUps: newFollowUps } = parseFollowUps(fullContent);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent('');
      setFollowUps(newFollowUps);
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

  // Handle website crawling
  const handleCrawlWebsite = async () => {
    if (!websiteUrl.trim()) return;

    setIsCrawling(true);
    setCrawlError(null);

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze website');
      }

      // Include additional context if provided
      const contextWithAdditional = {
        ...data.businessInfo,
        additionalContext: additionalContext.trim() || undefined,
      };
      setWebsiteContext(contextWithAdditional);
      setShowWebsiteModal(false);

      // Auto-set industry if detected
      if (data.businessInfo?.industry && !industry) {
        setIndustry(data.businessInfo.industry);
      }
    } catch (error) {
      setCrawlError(error instanceof Error ? error.message : 'Failed to analyze website');
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Website Analyzer Modal */}
      {showWebsiteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 max-w-lg w-full shadow-xl my-8">
            <h3 className="text-xl font-bold text-white mb-2">Analyze Your Business</h3>
            <p className="text-zinc-400 text-sm mb-4">
              I&apos;ll crawl your website to understand your business. Add extra context below for even better advice.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourbusiness.com"
                  className="w-full px-4 py-3 text-sm text-white bg-zinc-700 border border-zinc-600 rounded-lg focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-zinc-500"
                  disabled={isCrawling}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Additional Context <span className="text-zinc-500">(optional)</span>
                </label>
                <textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Add info that's NOT on your website:
• How your product actually works (user flow)
• Current metrics (MRR, users, conversion rates)
• Biggest challenges you're facing
• What you've already tried
• Your goals and timeline"
                  className="w-full px-4 py-3 text-sm text-white bg-zinc-700 border border-zinc-600 rounded-lg focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-zinc-500 min-h-[120px] resize-y"
                  disabled={isCrawling}
                />
                <p className="text-xs text-zinc-500 mt-1">
                  The more context you provide, the more specific my advice will be.
                </p>
              </div>

              {crawlError && (
                <p className="text-red-400 text-sm">{crawlError}</p>
              )}

              <button
                onClick={handleCrawlWebsite}
                disabled={!websiteUrl.trim() || isCrawling}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isCrawling ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing (this may take 10-20 seconds)...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Analyze My Business
                  </>
                )}
              </button>
            </div>
            <button
              onClick={() => {
                setShowWebsiteModal(false);
                setCrawlError(null);
              }}
              className="mt-4 w-full text-sm text-zinc-500 hover:text-zinc-300"
              disabled={isCrawling}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Unsaved Changes</h3>
            <p className="text-zinc-400 text-sm mb-6">
              You have an unsaved conversation. Would you like to save it before continuing?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  handleSaveConversation();
                  setShowUnsavedWarning(false);
                  if (pendingAction) {
                    pendingAction();
                    setPendingAction(null);
                  }
                }}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors"
              >
                Save & Continue
              </button>
              <button
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setHasUnsavedChanges(false);
                  if (pendingAction) {
                    pendingAction();
                    setPendingAction(null);
                  }
                }}
                className="w-full px-4 py-3 text-sm font-medium text-red-400 bg-red-900/30 border border-red-600/30 rounded-lg hover:bg-red-900/50 transition-colors"
              >
                Discard & Continue
              </button>
              <button
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setPendingAction(null);
                }}
                className="w-full px-4 py-3 text-sm font-medium text-zinc-400 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation Toast */}
      {showSaveConfirm && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-emerald-900/90 border border-emerald-600/50 text-emerald-300 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Conversation saved!
          </div>
        </div>
      )}

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
            title="View and switch between your saved conversations"
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
            onRename={handleRenameConversation}
            isOpen={showConversationList}
            onClose={() => setShowConversationList(false)}
          />

          {industry && (
            <button
              onClick={() => setShowIndustrySelector(true)}
              className="px-3 py-1 text-xs font-medium text-sky-400 bg-sky-900/30 border border-sky-600/30 rounded-full hover:bg-sky-900/50 transition-colors"
              title="Click to change your industry for more relevant advice"
            >
              {industry} ✎
            </button>
          )}
          {!industry && (
            <button
              onClick={() => setShowIndustrySelector(true)}
              className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full hover:border-zinc-600 transition-colors"
              title="Set your industry for personalized business advice"
            >
              + Set Industry
            </button>
          )}
          {/* Website Context Indicator/Button */}
          {websiteContext ? (
            <button
              onClick={() => setShowWebsiteModal(true)}
              className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-900/30 border border-emerald-600/30 rounded-full hover:bg-emerald-900/50 transition-colors flex items-center gap-1"
              title={`Analyzing: ${websiteContext.businessName || 'Your Business'} - Click to change`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {websiteContext.businessName || 'Site Analyzed'} ✎
            </button>
          ) : (
            <button
              onClick={() => setShowWebsiteModal(true)}
              className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full hover:border-zinc-600 transition-colors flex items-center gap-1"
              title="Analyze your website for personalized business advice"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              + My Website
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Save button - only shows when there are unsaved changes */}
          {hasUnsavedChanges && messages.length > 0 && (
            <button
              onClick={handleSaveConversation}
              className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-900/30 border border-emerald-600/50 rounded-lg hover:bg-emerald-900/50 transition-colors flex items-center gap-1.5"
              title="Save this conversation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </button>
          )}
          {/* Export Markdown button */}
          {messages.length > 0 && (
            <button
              onClick={handleExportMarkdown}
              className="text-xs text-zinc-400 hover:text-sky-300 transition-colors flex items-center gap-1"
              title="Export conversation as Markdown"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          )}
          {/* New Chat button */}
          <button
            onClick={handleNewConversation}
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1"
            title="Start a new conversation"
          >
            <span>+</span> New Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 -mt-8">
            <div className="mb-4">
              <Image
                src="/hormozi-logo.png"
                alt="Alex Hormozi"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Talk to <span className="text-sky-400">Alex Hormozi AI</span>
            </h2>
            <p className="text-zinc-400 max-w-md mb-4">
              Get business advice using the frameworks from $100M Offers and $100M Leads.
              Ask about offers, pricing, leads, LTV/CAC, or anything business.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              {!websiteContext && (
                <button
                  onClick={() => setShowWebsiteModal(true)}
                  className="px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-600/50 rounded-lg hover:bg-emerald-900/30 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Analyze My Website
                </button>
              )}
              {!industry && (
                <button
                  onClick={() => setShowIndustrySelector(true)}
                  className="px-4 py-2 text-sm font-medium text-sky-400 border border-sky-600/50 rounded-lg hover:bg-sky-900/30 transition-colors"
                >
                  Select Your Industry
                </button>
              )}
            </div>
            <QuickActions onSelect={sendMessage} disabled={isLoading} />
            {/* Input Area - Centered in welcome state */}
            <div className="w-full max-w-2xl mt-6">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about offers, leads, pricing, LTV/CAC, or any other business-related question..."
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
            {/* Suggested follow-up questions */}
            {!isLoading && followUps.length > 0 && (
              <div className="px-4 mb-4">
                <SuggestedQuestions
                  questions={followUps}
                  onQuestionClick={(question) => sendMessage(question)}
                  disabled={isLoading}
                />
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
              placeholder="Ask about offers, leads, pricing, LTV/CAC, or any other business-related question..."
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
