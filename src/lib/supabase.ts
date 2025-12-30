import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Usage limits
export const USAGE_LIMITS = {
  FREE: {
    chats: 10,
    playbooks: 1,
    scores: 1,
  },
  PAID: {
    chats: Infinity,
    playbooks: Infinity,
    scores: Infinity,
  },
};

// Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  is_paid: boolean;
  stripe_customer_id: string | null;
  created_at: string;
}

export interface Usage {
  id: string;
  user_id: string;
  chat_count: number;
  playbook_count: number;
  score_count: number;
  updated_at: string;
}
