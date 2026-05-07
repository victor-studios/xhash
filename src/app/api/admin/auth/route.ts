import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { comparePassword, verifyPin, signAdminToken } from '@/lib/admin-auth';

/**
 * POST /api/admin/auth
 * Admin login: username + password + PIN (required for Level 1)
 */
export async function POST(req: NextRequest) {
  try {
    const { username, password, pin } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();

    // Fetch admin by username
    const { data: admin, error } = await supabase
      .from('platform_admins')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const passwordValid = await comparePassword(password, admin.password_hash);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // PIN is required for all admin logins
    if (!pin) {
      return NextResponse.json({ error: 'Security PIN is required' }, { status: 400 });
    }

    // Verify PIN (same PIN for all admins, stored in DB or default)
    const pinValid = await verifyPin(pin);
    if (!pinValid) {
      return NextResponse.json({ error: 'Invalid security PIN' }, { status: 401 });
    }

    // Update last login
    await supabase
      .from('platform_admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Log the login activity
    await supabase.from('admin_activity_log').insert({
      admin_id: admin.id,
      admin_username: admin.username,
      action: 'login',
      details: { ip: req.headers.get('x-forwarded-for') || 'unknown' },
    });

    // Sign JWT
    const token = signAdminToken({
      adminId: admin.id,
      username: admin.username,
      level: admin.level,
      displayName: admin.display_name || admin.username,
    });

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        level: admin.level,
        displayName: admin.display_name,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
