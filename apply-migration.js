// Apply the purchase_mining_plan RPC migration via Supabase Management API
const fs = require('fs');
const sql = fs.readFileSync('./supabase_migration_purchase_rpc.sql', 'utf8');

async function applyMigration() {
  // Use the Supabase PostgreSQL wire protocol endpoint 
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    'https://eolqzluqvtzvbssyapin.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbHF6bHVxdnR6dmJzc3lhcGluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODEwNjY1NCwiZXhwIjoyMDkzNjgyNjU0fQ.iXblCMvMcPfLU4LxrsNbaALIrT5jTJlbIew9qSOSgpo',
    { db: { schema: 'public' } }
  );

  // Execute the raw SQL using the Supabase client's internal method
  let data, error;
  try {
    const res = await supabase.rpc('exec_sql', { query: sql });
    data = res.data;
    error = res.error;
  } catch (e) {
    error = e;
  }
  
  if (error) {
    console.log('RPC method not available, trying direct SQL via pg...');
    
    // Alternative: use the internal SQL endpoint  
    const response = await fetch('https://eolqzluqvtzvbssyapin.supabase.co/pg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbHF6bHVxdnR6dmJzc3lhcGluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODEwNjY1NCwiZXhwIjoyMDkzNjgyNjU0fQ.iXblCMvMcPfLU4LxrsNbaALIrT5jTJlbIew9qSOSgpo',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbHF6bHVxdnR6dmJzc3lhcGluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODEwNjY1NCwiZXhwIjoyMDkzNjgyNjU0fQ.iXblCMvMcPfLU4LxrsNbaALIrT5jTJlbIew9qSOSgpo',
      },
      body: JSON.stringify({ query: sql })
    });
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', text);
  } else {
    console.log('Migration applied successfully!', data);
  }
}

applyMigration().catch(console.error);
