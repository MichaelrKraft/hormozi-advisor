import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { data: usage, error } = await supabaseAdmin
      .from('usage')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      // Create usage record if doesn't exist
      if (error.code === 'PGRST116') {
        const { data: newUsage } = await supabaseAdmin
          .from('usage')
          .insert({ user_id: session.user.id })
          .select()
          .single();
        return NextResponse.json(newUsage);
      }
      throw error;
    }

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { type } = await request.json();

    if (!['chat', 'playbook', 'score'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid usage type' },
        { status: 400 }
      );
    }

    const columnName = `${type}_count`;

    // Get current usage
    const { data: currentUsage } = await supabaseAdmin
      .from('usage')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!currentUsage) {
      // Create if doesn't exist
      const { data: newUsage } = await supabaseAdmin
        .from('usage')
        .insert({
          user_id: session.user.id,
          [columnName]: 1,
        })
        .select()
        .single();
      return NextResponse.json(newUsage);
    }

    // Increment usage
    const { data: updatedUsage, error } = await supabaseAdmin
      .from('usage')
      .update({
        [columnName]: currentUsage[columnName] + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(updatedUsage);
  } catch (error) {
    console.error('Error updating usage:', error);
    return NextResponse.json(
      { error: 'Failed to update usage' },
      { status: 500 }
    );
  }
}
