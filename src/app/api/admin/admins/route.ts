import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { extractAdminToken, hasPermission, hashPassword } from '@/lib/admin-auth';

/**
 * GET /api/admin/admins
 * List all admins (Level 1 only)
 */
export async function GET(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const supabase = createAdminSupabaseClient();

    const { data: admins, error } = await supabase
      .from('platform_admins')
      .select('id, username, level, display_name, is_active, created_at, last_login')
      .order('level', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ admins: admins || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/admins
 * Create a new admin (Level 1 only)
 */
export async function POST(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const { username, password, level, displayName } = await req.json();

    if (!username || !password || !level) {
      return NextResponse.json({ error: 'Username, password, and level are required' }, { status: 400 });
    }

    if (![1, 2, 3].includes(level)) {
      return NextResponse.json({ error: 'Level must be 1, 2, or 3' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    // Check if username already exists
    const { data: existing } = await supabase
      .from('platform_admins')
      .select('id')
      .eq('username', username.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const { data: newAdmin, error } = await supabase
      .from('platform_admins')
      .insert({
        username: username.toLowerCase().trim(),
        password_hash: passwordHash,
        level,
        display_name: displayName || username,
        created_by: admin.adminId,
      })
      .select('id, username, level, display_name, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from('admin_activity_log').insert({
      admin_id: admin.adminId,
      admin_username: admin.username,
      action: 'create_admin',
      details: { newAdminUsername: username, level },
    });

    return NextResponse.json({ admin: newAdmin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/admins
 * Delete/deactivate an admin (Level 1 only)
 */
export async function DELETE(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const { adminId } = await req.json();

    if (adminId === admin.adminId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    const { error } = await supabase
      .from('platform_admins')
      .update({ is_active: false })
      .eq('id', adminId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from('admin_activity_log').insert({
      admin_id: admin.adminId,
      admin_username: admin.username,
      action: 'deactivate_admin',
      details: { deactivatedAdminId: adminId },
    });

    return NextResponse.json({ message: 'Admin deactivated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
