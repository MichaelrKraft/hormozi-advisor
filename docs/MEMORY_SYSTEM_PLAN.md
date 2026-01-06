# Plan: Add Persistent Memory to Hormozi Advisor

> **Status**: Planned (not yet implemented)
> **Created**: January 2026
> **Estimated Time**: 4-5 hours

## Summary
Add persistent user memory to Hormozi Advisor so the AI remembers who you are and learns from past conversations. Uses Google OAuth for authentication and auto-summarizes conversations to build user context over time.

## What Memory Will Do
After implementation, Hormozi will know:
- **Your Profile**: Name, business type, revenue, scaling stage
- **Your History**: Past topics discussed, strategies you've tried
- **Your Metrics**: CAC, LTV, price points you've mentioned
- **Your Challenges**: Current constraints and obstacles
- **Follow-ups**: Things to check on from past conversations

---

## Current State
- **Project**: `/Users/michaelkraft/hormozi-advisor/`
- **Stack**: Next.js 16, React 19, TypeScript, Tailwind
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)
- **Storage**: localStorage only (client-side)
- **Auth**: NextAuth installed but not configured
- **Database**: Supabase credentials in .env but not used

---

## Implementation Plan

### Phase 1: Google OAuth Setup (30 min)
**Goal**: Users can sign in with Google

**Files to Create/Modify**:
1. `/src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route
2. `/src/lib/auth.ts` - Auth configuration with Google provider
3. `/src/components/AuthButton.tsx` - Sign in/out button component
4. `.env.local` - Add Google OAuth credentials

**Steps**:
1. Create NextAuth configuration with Google OAuth provider
2. Add SessionProvider to app layout
3. Create sign-in button component
4. Protect chat API with session check

---

### Phase 2: Supabase Database Setup (30 min)
**Goal**: Server-side storage for users, conversations, and memory

**Files to Create**:
1. `/src/lib/db/supabase.ts` - Supabase client wrapper
2. `/src/lib/db/schema.sql` - SQL schema (for reference)

**Database Tables**:
```sql
-- Users (synced from Google OAuth)
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP
)

-- User profiles (business context)
user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  business_name TEXT,
  industry TEXT,
  revenue TEXT,
  stage TEXT,  -- 'pre-revenue', 'first-sales', 'scaling', 'mature'
  constraint TEXT,
  updated_at TIMESTAMP
)

-- Conversation memory
user_memory (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  summary TEXT,          -- AI-generated summary of all conversations
  strategies_tried TEXT[], -- Array of strategies mentioned
  metrics_mentioned JSONB, -- {cac: "$50", ltv: "$500", etc.}
  current_challenges TEXT[],
  follow_up_items TEXT[],
  updated_at TIMESTAMP
)

-- Conversation history (optional, for reference)
conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  title TEXT,
  summary TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Steps**:
1. Create tables in Supabase dashboard (or via SQL)
2. Enable Row Level Security (RLS) policies
3. Create Supabase client with service role for API

---

### Phase 3: Memory Service (1-2 hours)
**Goal**: Auto-extract and store user context from conversations

**Files to Create**:
1. `/src/lib/memory/memory-service.ts` - Core memory operations
2. `/src/lib/memory/conversation-analyzer.ts` - Extract info from conversations
3. `/src/lib/memory/memory-prompt.ts` - Prompt for AI to analyze conversations

**How Auto-Summary Works**:
```
After each conversation:
1. Send conversation to Claude with extraction prompt
2. Claude returns structured data:
   - Business context (industry, stage, revenue)
   - Strategies mentioned
   - Metrics mentioned
   - Current challenges
   - Follow-up items
3. Merge with existing user_memory record
4. Update user_profiles if new info found
```

**Memory Service API**:
```typescript
// Get user's memory context for system prompt
getMemoryContext(userId: string): Promise<UserMemory>

// Update memory after conversation
updateMemory(userId: string, messages: Message[]): Promise<void>

// Update user profile
updateProfile(userId: string, profile: Partial<UserProfile>): Promise<void>
```

---

### Phase 4: Chat API Integration (1 hour)
**Goal**: Inject memory into system prompt, save conversations

**Files to Modify**:
1. `/src/app/api/chat/route.ts` - Add memory injection + saving

**Changes**:
```typescript
// Before: Stateless, no user context
export async function POST(request: Request) {
  const { messages } = await request.json();
  // ... call Claude with fixed system prompt
}

// After: User-aware with memory
export async function POST(request: Request) {
  // 1. Get user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return unauthorized();

  // 2. Load user memory
  const memory = await getMemoryContext(session.user.id);

  // 3. Build personalized system prompt
  const systemPrompt = buildSystemPrompt(memory);

  // 4. Call Claude
  const response = await claude.messages.create({...});

  // 5. Update memory (async, don't block response)
  updateMemory(session.user.id, messages).catch(console.error);

  return response;
}
```

**System Prompt Addition**:
```
## ABOUT THIS USER (from memory)

Name: {name}
Business: {business_name} ({industry})
Stage: {stage}
Revenue: {revenue}
Main Constraint: {constraint}

## WHAT WE'VE DISCUSSED BEFORE

Topics covered: {topics_list}
Strategies they've tried: {strategies_list}
Key metrics they mentioned: CAC: {cac}, LTV: {ltv}, Price: {price}

## CURRENT CHALLENGES

{challenges_list}

## FOLLOW-UP ITEMS FROM PAST CONVERSATIONS

{follow_ups_list}

Use this context to give personalized advice. Reference past discussions when relevant.
```

---

### Phase 5: UI Components (1 hour)
**Goal**: Profile setup, memory display, sign-in flow

**Files to Create/Modify**:
1. `/src/components/AuthButton.tsx` - Sign in/out with Google
2. `/src/components/UserProfile.tsx` - Profile setup/edit modal
3. `/src/components/MemorySidebar.tsx` - Show what AI knows about you
4. `/src/app/chat/page.tsx` - Add profile and memory components

**User Profile Modal Fields**:
- Business name (optional)
- Industry (dropdown)
- Revenue range (dropdown)
- Scaling stage (dropdown)
- Current main constraint (text)

**Memory Sidebar Shows**:
- "What Alex Knows About You"
- Profile summary
- Strategies discussed
- Key metrics
- Edit button to correct info

---

## Files Summary

### New Files (9)
```
/src/app/api/auth/[...nextauth]/route.ts  - Auth API
/src/lib/auth.ts                          - Auth config
/src/lib/db/supabase.ts                   - DB client
/src/lib/memory/memory-service.ts         - Core memory ops
/src/lib/memory/conversation-analyzer.ts  - Extract info
/src/lib/memory/memory-prompt.ts          - Extraction prompt
/src/components/AuthButton.tsx            - Sign in button
/src/components/UserProfile.tsx           - Profile modal
/src/components/MemorySidebar.tsx         - Memory display
```

### Modified Files (4)
```
/src/app/layout.tsx                       - Add SessionProvider
/src/app/api/chat/route.ts               - Add memory + auth
/src/app/chat/page.tsx                   - Add UI components
/src/lib/prompts/chatSystemPrompt.ts     - Memory injection point
```

### Environment Variables Needed
```bash
# Google OAuth (get from console.cloud.google.com)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_SECRET=      # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Supabase (already in .env.example)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Execution Order

1. **Phase 1**: Google OAuth (must be first - enables user tracking)
2. **Phase 2**: Supabase tables (foundation for storage)
3. **Phase 3**: Memory service (core intelligence)
4. **Phase 4**: Chat API integration (ties it together)
5. **Phase 5**: UI components (user-facing polish)

---

## Success Criteria

- [ ] User can sign in with Google
- [ ] User can fill out profile (business, industry, stage, revenue)
- [ ] Chat remembers user's name and business across sessions
- [ ] After discussing strategies, they appear in memory
- [ ] Metrics mentioned in chat are extracted and stored
- [ ] System prompt includes personalized context
- [ ] User can see and edit what the AI knows about them

---

## Estimated Time

| Phase | Time |
|-------|------|
| Phase 1: Google OAuth | 30 min |
| Phase 2: Supabase Setup | 30 min |
| Phase 3: Memory Service | 1-2 hours |
| Phase 4: Chat API Integration | 1 hour |
| Phase 5: UI Components | 1 hour |
| **Total** | **4-5 hours** |

---

## Notes

- Memory updates happen asynchronously (don't slow down chat)
- localStorage still works as fallback for unsigned users
- Memory extraction uses a separate Claude call after each conversation
- Profile edits by user override auto-extracted data
