'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Check if auth backend is configured (Supabase URL indicates full setup)
  // Skip SessionProvider entirely until user sets up Supabase
  const isAuthConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!isAuthConfigured) {
    // Auth not configured - render without session management
    // This prevents CLIENT_FETCH_ERROR until user completes setup
    return <>{children}</>;
  }

  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
