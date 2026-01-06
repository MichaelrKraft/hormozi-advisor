'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "I'm stuck in a rut. How do I get out?",
  "How do I stop procrastinating?",
  "I feel like I'm not living up to my potential",
  "How do I deal with toxic people in my life?",
  "I'm scared to take risks. What should I do?",
];

export default function LifeChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/life-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setStreamingContent(fullContent);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
      setStreamingContent('');
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't process that. Try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-zinc-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <h1 className="text-white font-semibold">Life Coach</h1>
              <p className="text-xs text-purple-400">137 Brutally Honest Truths</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMessages([])}
          className="text-zinc-500 hover:text-white text-sm"
        >
          Clear
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streamingContent && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧠</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Life Advice from Alex Hormozi</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Get brutally honest advice on life, mindset, relationships, and personal growth.
              <span className="block mt-2 font-semibold bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent">
                No BS. No excuses. Just truth.
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {SUGGESTED_QUESTIONS.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleQuestionClick(question)}
                  className="px-3 py-2 text-sm bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white'
                  : 'bg-zinc-800 text-zinc-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-zinc-800 text-zinc-100">
              <p className="whitespace-pre-wrap">{streamingContent}</p>
            </div>
          </div>
        )}

        {isLoading && !streamingContent && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask about life, mindset, relationships..."
            className="flex-1 bg-zinc-800 text-white rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-400 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
