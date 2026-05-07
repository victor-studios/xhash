import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { extractAdminToken, hasPermission } from '@/lib/admin-auth';

/**
 * GET /api/admin/activity
 * Admin activity log (Level 1 only)
 */
export async function GET(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const { data: logs, count, error } = await supabase
      .from('admin_activity_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      logs: logs || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
