'use client';

import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-sky-600 text-white rounded-br-md'
            : 'bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-bl-md'
        }`}
      >
        {/* Render message content with markdown-like formatting */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content.split('\n').map((line, i) => {
            // Handle headers
            if (line.startsWith('### ')) {
              return (
                <h3 key={i} className={`font-bold text-base mt-3 mb-1 ${!isUser && 'text-sky-400'}`}>
                  {line.replace('### ', '')}
                </h3>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={i} className={`font-bold text-lg mt-4 mb-2 ${!isUser && 'text-sky-400'}`}>
                  {line.replace('## ', '')}
                </h2>
              );
            }
            // Handle bullet points
            if (line.startsWith('- ') || line.startsWith('• ')) {
              return (
                <p key={i} className="ml-4">
                  {line}
                </p>
              );
            }
            // Handle numbered lists
            if (/^\d+\.\s/.test(line)) {
              return (
                <p key={i} className="ml-4">
                  {line}
                </p>
              );
            }
            // Handle bold text
            if (line.includes('**')) {
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={i}>
                  {parts.map((part, j) =>
                    j % 2 === 1 ? (
                      <strong key={j} className={!isUser ? 'text-sky-300' : ''}>
                        {part}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              );
            }
            // Regular text
            return line ? <p key={i}>{line}</p> : <br key={i} />;
          })}
        </div>
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-sky-200' : 'text-zinc-500'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
