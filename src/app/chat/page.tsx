import Link from 'next/link';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-lg font-bold text-white">Hormozi Advisor</span>
          </Link>
          <Link
            href="/generator"
            className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
          >
            Generate Playbook
          </Link>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
