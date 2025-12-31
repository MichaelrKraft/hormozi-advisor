'use client';

import { useState } from 'react';
import type { ConversationMeta } from '@/types/conversation';

interface ConversationListProps {
  conversations: ConversationMeta[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename?: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConversationList({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  isOpen,
  onClose,
}: ConversationListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const handleStartEdit = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
    setConfirmDelete(null);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim() && onRename) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-2 w-80 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-50 overflow-hidden">
        {/* New Conversation Button */}
        <button
          onClick={() => {
            onNew();
            onClose();
          }}
          className="w-full px-4 py-3 text-left bg-sky-600/10 border-b border-zinc-700 hover:bg-sky-600/20 transition-colors flex items-center gap-2"
        >
          <span className="text-sky-400">+</span>
          <span className="text-sky-400 font-medium">New Conversation</span>
        </button>

        {/* Conversation List */}
        <div className="max-h-96 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-500">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onSelect(conv.id);
                  onClose();
                }}
                className={`px-4 py-3 cursor-pointer border-b border-zinc-700/50 hover:bg-zinc-700/50 transition-colors ${
                  conv.id === currentId ? 'bg-zinc-700/30' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {conv.id === currentId && (
                        <span className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0" />
                      )}
                      {editingId === conv.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={() => handleSaveEdit(conv.id)}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === 'Enter') handleSaveEdit(conv.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="flex-1 text-white font-medium text-sm bg-zinc-700 border border-sky-500 rounded px-2 py-0.5 outline-none"
                          autoFocus
                        />
                      ) : (
                        <>
                          <h4 className="text-white font-medium truncate text-sm">
                            {conv.title}
                          </h4>
                          {onRename && (
                            <button
                              onClick={(e) => handleStartEdit(conv.id, conv.title, e)}
                              className="flex-shrink-0 text-zinc-500 hover:text-sky-400 transition-colors p-0.5"
                              title="Rename conversation"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-zinc-500 text-xs mt-1 truncate">
                      {conv.preview}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                      <span>{formatDate(conv.updatedAt)}</span>
                      <span>•</span>
                      <span>{conv.messageCount} messages</span>
                      {conv.industry && (
                        <>
                          <span>•</span>
                          <span className="text-sky-400/60">{conv.industry}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className={`flex-shrink-0 px-2 py-1 rounded text-xs transition-colors ${
                      confirmDelete === conv.id
                        ? 'bg-red-600 text-white'
                        : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-700'
                    }`}
                  >
                    {confirmDelete === conv.id ? 'Confirm' : '×'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
