'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { USAGE_LIMITS } from '@/lib/supabase';

interface UsageData {
  chat_count: number;
  playbook_count: number;
  score_count: number;
}

interface UseUsageReturn {
  usage: UsageData | null;
  isLoading: boolean;
  isPaid: boolean;
  canUseChat: boolean;
  canUsePlaybook: boolean;
  canUseScore: boolean;
  chatRemaining: number;
  playbookRemaining: number;
  scoreRemaining: number;
  incrementChat: () => Promise<boolean>;
  incrementPlaybook: () => Promise<boolean>;
  incrementScore: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useUsage(): UseUsageReturn {
  const { data: session, status } = useSession();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isPaid = session?.user?.isPaid ?? false;
  const limits = isPaid ? USAGE_LIMITS.PAID : USAGE_LIMITS.FREE;

  const fetchUsage = useCallback(async () => {
    if (status === 'loading') return;

    if (!session?.user?.id) {
      // For anonymous users, check localStorage
      const localUsage = localStorage.getItem('hormozi_usage');
      if (localUsage) {
        setUsage(JSON.parse(localUsage));
      } else {
        setUsage({ chat_count: 0, playbook_count: 0, score_count: 0 });
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, status]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const incrementUsage = async (type: 'chat' | 'playbook' | 'score'): Promise<boolean> => {
    if (!usage) return false;

    const countKey = `${type}_count` as keyof UsageData;
    const limitKey = `${type}s` as keyof typeof limits;

    if (usage[countKey] >= limits[limitKey]) {
      return false;
    }

    if (!session?.user?.id) {
      // Anonymous user - use localStorage
      const newUsage = {
        ...usage,
        [countKey]: usage[countKey] + 1,
      };
      localStorage.setItem('hormozi_usage', JSON.stringify(newUsage));
      setUsage(newUsage);
      return true;
    }

    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsage(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  const chatCount = usage?.chat_count ?? 0;
  const playbookCount = usage?.playbook_count ?? 0;
  const scoreCount = usage?.score_count ?? 0;

  return {
    usage,
    isLoading,
    isPaid,
    canUseChat: isPaid || chatCount < limits.chats,
    canUsePlaybook: isPaid || playbookCount < limits.playbooks,
    canUseScore: isPaid || scoreCount < limits.scores,
    chatRemaining: Math.max(0, limits.chats - chatCount),
    playbookRemaining: Math.max(0, limits.playbooks - playbookCount),
    scoreRemaining: Math.max(0, limits.scores - scoreCount),
    incrementChat: () => incrementUsage('chat'),
    incrementPlaybook: () => incrementUsage('playbook'),
    incrementScore: () => incrementUsage('score'),
    refetch: fetchUsage,
  };
}
