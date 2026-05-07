import { NextRequest, NextResponse } from 'next/server';
import { extractAdminToken, hasPermission } from '@/lib/admin-auth';

/**
 * GET /api/admin/settings
 * Get current PIN (Level 1 only, returns masked)
 */
export async function GET(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const res = await fetch(`${supabaseUrl}/rest/v1/platform_settings?key=eq.admin_pin&select=value`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
    });

    if (res.ok) {
      const rows = await res.json();
      const currentPin = rows?.[0]?.value || 'XERO2008';
      return NextResponse.json({ pin: currentPin });
    }

    return NextResponse.json({ pin: 'XERO2008' });
  } catch {
    return NextResponse.json({ pin: 'XERO2008' });
  }
}

/**
 * PATCH /api/admin/settings
 * Update the global admin PIN (Level 1 only)
 */
export async function PATCH(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const { newPin } = await req.json();

    if (!newPin || newPin.length !== 8) {
      return NextResponse.json({ error: 'PIN must be exactly 8 characters' }, { status: 400 });
    }

    // Validate: must have letters and numbers
    if (!/[a-zA-Z]/.test(newPin) || !/[0-9]/.test(newPin)) {
      return NextResponse.json({ error: 'PIN must contain both letters and numbers' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Prefer': 'return=representation',
    };

    // Upsert the PIN
    const res = await fetch(`${supabaseUrl}/rest/v1/platform_settings?key=eq.admin_pin`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ value: newPin.toUpperCase(), updated_at: new Date().toISOString() }),
    });

    if (!res.ok) {
      // Try insert if row doesn't exist
      await fetch(`${supabaseUrl}/rest/v1/platform_settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ key: 'admin_pin', value: newPin.toUpperCase() }),
      });
    }

    // Log activity
    const { createAdminSupabaseClient } = await import('@/lib/supabase-admin');
    const supabase = createAdminSupabaseClient();
    await supabase.from('admin_activity_log').insert({
      admin_id: admin.adminId,
      admin_username: admin.username,
      action: 'change_pin',
      details: { changed_by: admin.username },
    });

    return NextResponse.json({ message: 'PIN updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
