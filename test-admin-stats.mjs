import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eolqzluqvtzvbssyapin.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbHF6bHVxdnR6dmJzc3lhcGluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODEwNjY1NCwiZXhwIjoyMDkzNjgyNjU0fQ.iXblCMvMcPfLU4LxrsNbaALIrT5jTJlbIew9qSOSgpo';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const validStatuses = ['Completed', 'Failed', 'In Progress', 'Waiting for payment', 'Cancelled', 'Rejected', 'Approved', 'Refunded'];
  
  for (const status of validStatuses) {
    const { error } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('status', status);
    if (!error) {
      console.log(`Status "${status}" is VALID`);
    } else {
      console.log(`Status "${status}" is INVALID: ${error.message}`);
    }
  }
}

check().catch(console.error);
