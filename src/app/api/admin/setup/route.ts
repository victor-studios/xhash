import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/admin/setup
 * Bootstrap: creates tables via temporary SQL function, then seeds admin.
 * Step 1: Create a temporary plpgsql function to run DDL
 * Step 2: Call it to create tables
 * Step 3: Drop the temporary function
 * Step 4: Seed super admin
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.setup_key !== 'xhash-admin-setup-2024') {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Use fetch directly against PostgreSQL connector endpoint
    // Supabase exposes a SQL endpoint at /pg for service role
    const headers = {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Prefer': 'return=representation',
    };

    // First, try to see if tables already exist by doing a direct query
    const checkRes = await fetch(`${supabaseUrl}/rest/v1/platform_admins?select=id&limit=1`, { headers });
    
    if (checkRes.ok) {
      // Table exists, check for admin
      const admins = await checkRes.json();
      const adminCheck = await fetch(`${supabaseUrl}/rest/v1/platform_admins?username=eq.exoxi&select=id`, { headers });
      const existing = await adminCheck.json();
      
      if (existing?.length > 0) {
        return NextResponse.json({ message: 'Setup complete. Super admin exists.', status: 'ok' });
      }

      // Insert admin
      const passwordHash = await hashPassword('Salmannh202008#');
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/platform_admins`, {
        method: 'POST', headers: { ...headers, 'Prefer': 'return=representation' },
        body: JSON.stringify({ username: 'exoxi', password_hash: passwordHash, level: 1, display_name: 'Super Admin', is_active: true }),
      });
      
      if (insertRes.ok) {
        return NextResponse.json({ message: 'Super admin created.', status: 'ok' });
      }
      const err = await insertRes.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    // Tables don't exist — return the SQL for the user to run
    return NextResponse.json({
      status: 'tables_needed',
      message: 'The admin tables do not exist yet. Please run the following SQL in your Supabase SQL Editor (Project Dashboard > SQL Editor > New Query), then call this endpoint again to seed the super admin.',
      sql: `-- XHash Admin Dashboard Tables Setup
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.platform_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 3 CHECK (level IN (1, 2, 3)),
  display_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  admin_reply TEXT,
  replied_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID,
  admin_username TEXT,
  action TEXT NOT NULL,
  details JSONB,
  target_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Set default PIN (XERO2008)
INSERT INTO public.platform_settings (key, value)
VALUES ('admin_pin', 'XERO2008')
ON CONFLICT (key) DO NOTHING;

-- Notify PostgREST to pick up the new tables
NOTIFY pgrst, 'reload schema';`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
