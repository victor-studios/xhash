import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { extractAdminToken, hasPermission } from '@/lib/admin-auth';

/**
 * GET /api/admin/support
 * List support messages (Level 1, 2, 3)
 */
export async function GET(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('support_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: messages, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      messages: messages || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/support
 * Reply to or update support message status (Level 1, 2)
 */
export async function PATCH(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 2)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { messageId, reply, status } = await req.json();
    const supabase = createAdminSupabaseClient();

    const updates: any = { updated_at: new Date().toISOString() };
    if (reply) {
      updates.admin_reply = reply;
      updates.replied_by = admin.adminId;
    }
    if (status) {
      updates.status = status;
    }

    const { error } = await supabase
      .from('support_messages')
      .update(updates)
      .eq('id', messageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from('admin_activity_log').insert({
      admin_id: admin.adminId,
      admin_username: admin.username,
      action: reply ? 'reply_support' : 'update_support_status',
      details: { messageId, status },
    });

    return NextResponse.json({ message: 'Support message updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
