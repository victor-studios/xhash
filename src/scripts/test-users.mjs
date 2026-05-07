import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function test() {
  console.log("Fetching profiles...");
  console.time("profiles");
  const { data: users, count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50);
  console.timeEnd("profiles");
  
  if (error) console.error("Profile error:", error);
  console.log("Profiles found:", count, users?.length);

  console.log("Fetching auth users...");
  console.time("auth");
  const { data, error: authError } = await supabase.auth.admin.listUsers({ perPage: 10 });
  console.timeEnd("auth");

  if (authError) console.error("Auth error:", authError);
  console.log("Auth users found:", data?.users?.length);
}

test();
