# Auth + Usage-Based Limits Implementation

## Overview
Implement authentication (Google + Email/Password) with usage-based limits and hard paywall.

## Tech Stack
- **Auth**: NextAuth.js (Google OAuth + Credentials provider)
- **Database**: Supabase (Postgres)
- **Payments**: Stripe (user already has account)

## Usage Limits
| Feature | Free | Paid |
|---------|------|------|
| Chat messages | 10 | Unlimited |
| Playbook generations | 1 | Unlimited |
| Business Score | 1 | Unlimited |
| Tools | Unlimited | Unlimited |

## Tasks

- [x] Plan architecture
- [x] Install dependencies (next-auth, @supabase/supabase-js, stripe, bcryptjs)
- [x] Create src/lib/supabase.ts - Supabase client
- [x] Create src/lib/auth.ts - NextAuth configuration
- [x] Create src/app/api/auth/[...nextauth]/route.ts - Auth endpoints
- [x] Create src/app/api/auth/signup/route.ts - Email signup
- [x] Create src/components/auth/AuthProvider.tsx - Session wrapper
- [x] Create src/components/auth/LoginModal.tsx - Login/signup UI
- [x] Create src/hooks/useUsage.ts - Usage tracking hook
- [x] Create src/app/api/usage/route.ts - Usage API
- [x] Create src/components/paywall/UpgradeModal.tsx - Hard paywall
- [x] Create src/app/api/checkout/route.ts - Stripe checkout
- [x] Create src/app/api/webhooks/stripe/route.ts - Stripe webhooks
- [x] Update src/app/layout.tsx - Add AuthProvider
- [x] Create .env.example - Environment variables template
- [ ] **USER ACTION**: Set up Supabase project and run SQL below
- [ ] **USER ACTION**: Configure Google OAuth credentials
- [ ] **USER ACTION**: Create Stripe products/prices
- [ ] Integrate usage checks into ChatInterface
- [ ] Integrate usage checks into Generator page

---

## USER SETUP REQUIRED

### 1. Supabase Setup

1. Go to https://supabase.com and create a new project
2. Go to SQL Editor and run this SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  image text,
  password_hash text,
  is_paid boolean default false,
  stripe_customer_id text,
  created_at timestamp with time zone default now()
);

-- Usage tracking table
create table usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade unique,
  chat_count integer default 0,
  playbook_count integer default 0,
  score_count integer default 0,
  updated_at timestamp with time zone default now()
);

-- Index for faster lookups
create index idx_users_email on users(email);
create index idx_usage_user_id on usage(user_id);
```

3. Get your keys from Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Google OAuth Setup

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

### 3. Stripe Setup

1. Go to https://dashboard.stripe.com/products
2. Create two products:
   - **Lifetime Access**: $97 one-time payment
   - **Monthly Access**: $9/month subscription
3. Copy the Price IDs (starts with `price_`)
4. Set up webhook at https://dashboard.stripe.com/webhooks
   - Endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`
5. Copy the Webhook Secret

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:
```bash
cp .env.example .env.local
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Files Created
- src/lib/auth.ts
- src/lib/supabase.ts
- src/types/next-auth.d.ts
- src/app/api/auth/[...nextauth]/route.ts
- src/app/api/auth/signup/route.ts
- src/app/api/usage/route.ts
- src/app/api/checkout/route.ts
- src/app/api/webhooks/stripe/route.ts
- src/components/auth/AuthProvider.tsx
- src/components/auth/LoginModal.tsx
- src/components/paywall/UpgradeModal.tsx
- src/hooks/useUsage.ts
- .env.example

## Review
All core auth infrastructure is in place. User needs to:
1. Set up Supabase project and run SQL
2. Configure Google OAuth
3. Create Stripe products
4. Add environment variables
5. Then we integrate usage checks into the chat and generator pages
