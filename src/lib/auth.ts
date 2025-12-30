import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if user exists
        const { data: user, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (error || !user) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Upsert user in Supabase
        const { error } = await supabaseAdmin
          .from('users')
          .upsert(
            {
              email: user.email,
              name: user.name,
              image: user.image,
            },
            { onConflict: 'email' }
          );

        if (error) {
          console.error('Error upserting user:', error);
          return false;
        }

        // Create usage record if doesn't exist
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          await supabaseAdmin.from('usage').upsert(
            { user_id: existingUser.id },
            { onConflict: 'user_id', ignoreDuplicates: true }
          );
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Get user data from Supabase
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, is_paid, stripe_customer_id')
          .eq('email', session.user.email)
          .single();

        if (user) {
          session.user.id = user.id;
          session.user.isPaid = user.is_paid;
          session.user.stripeCustomerId = user.stripe_customer_id;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/', // We'll use a modal instead
  },
  session: {
    strategy: 'jwt',
  },
};
