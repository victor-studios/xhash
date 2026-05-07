import pg from 'pg';
import bcrypt from 'bcryptjs';

const DATABASE_URL = `postgresql://postgres.eolqzluqvtzvbssyapin:${process.env.DB_PASSWORD || 'your-db-password'}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;

// Try the direct connection URL format
const connectionString = process.env.DATABASE_URL || DATABASE_URL;

async function main() {
  console.log('Connecting to Supabase PostgreSQL...');
  
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create tables
    console.log('Creating platform_admins table...');
    await client.query(`
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
    `);
    console.log('✅ platform_admins created');

    console.log('Creating support_messages table...');
    await client.query(`
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
    `);
    console.log('✅ support_messages created');

    console.log('Creating admin_activity_log table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.admin_activity_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        admin_id UUID,
        admin_username TEXT,
        action TEXT NOT NULL,
        details JSONB,
        target_user_id UUID,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);
    console.log('✅ admin_activity_log created');

    // Seed super admin
    console.log('Seeding super admin...');
    const passwordHash = await bcrypt.hash('Salmannh202008#', 12);

    const { rows } = await client.query(
      `INSERT INTO public.platform_admins (username, password_hash, level, display_name, is_active)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username`,
      ['exoxi', passwordHash, 1, 'Super Admin', true]
    );

    if (rows.length > 0) {
      console.log('✅ Super admin created:', rows[0]);
    } else {
      console.log('ℹ️  Super admin already exists');
    }

    console.log('\n🎉 Setup complete!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();
