'use client';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({
  questions,
  onQuestionClick,
  disabled = false,
}: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {questions.map((question, index) => (
        <button
          key={index}
          onClick={() => onQuestionClick(question)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm text-sky-400 bg-zinc-800/50 hover:bg-zinc-700/50
                     border border-zinc-700 hover:border-sky-500/50 rounded-full
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     text-left"
        >
          {question}
        </button>
      ))}
    </div>
  );
}

// Utility function to parse follow-ups from message content
export function parseFollowUps(content: string): { cleanContent: string; followUps: string[] } {
  const followUpMatch = content.match(/<follow_ups>\s*(\[[\s\S]*?\])\s*<\/follow_ups>/);

  if (!followUpMatch) {
    return { cleanContent: content, followUps: [] };
  }

  try {
    const followUps = JSON.parse(followUpMatch[1]) as string[];
    const cleanContent = content.replace(/<follow_ups>[\s\S]*?<\/follow_ups>/, '').trim();
    return { cleanContent, followUps };
  } catch {
    // If JSON parsing fails, return content as-is
    return { cleanContent: content, followUps: [] };
  }
}
