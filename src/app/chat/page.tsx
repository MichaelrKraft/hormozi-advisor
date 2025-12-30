import MobileHeader from '@/components/layout/MobileHeader';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-zinc-900">
      <MobileHeader currentPage="chat" />

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
}
