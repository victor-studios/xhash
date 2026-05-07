import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eolqzluqvtzvbssyapin.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvbHF6bHVxdnR6dmJzc3lhcGluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODEwNjY1NCwiZXhwIjoyMDkzNjgyNjU0fQ.iXblCMvMcPfLU4LxrsNbaALIrT5jTJlbIew9qSOSgpo';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testStats() {
  // 1. Check which tables exist
  const { data: tables } = await supabase.rpc('', {}).catch(() => ({ data: null }));
  
  // Alternative: check tables via information_schema using a raw query workaround
  const { data: allTx, error: txErr } = await supabase
    .from('transactions')
    .select('id, type, status, amount, created_at')
    .order('created_at', { ascending: false });
  console.log('=== ALL TRANSACTIONS ===');
  console.log(JSON.stringify(allTx, null, 2));
  
  // 2. Test withdrawal query exactly as in the API
  const { data: withdrawData, error: wErr } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'withdraw')
    .in('status', ['Completed', 'Confirmed']);
  console.log('\n=== WITHDRAW COMPLETED/CONFIRMED ===');
  console.log('Data:', withdrawData);
  console.log('Error:', wErr);
  const totalWithdrawals = withdrawData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  console.log('Total:', totalWithdrawals);
  
  // 3. Pending withdrawals
  const { count: pendingWithdrawals, error: pErr } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'withdraw')
    .in('status', ['Pending', 'Processing', 'In Progress']);
  console.log('\n=== PENDING WITHDRAWALS ===');
  console.log('Count:', pendingWithdrawals, 'Error:', pErr);
  
  // 4. Check if support_messages table exists
  const { data: supportData, error: supportErr } = await supabase
    .from('support_messages')
    .select('*', { count: 'exact', head: true });
  console.log('\n=== SUPPORT MESSAGES TABLE ===');
  console.log('Data:', supportData, 'Error:', supportErr);
  
  // 5. Check orders table  
  const { data: orders, count: totalOrders, error: oErr } = await supabase
    .from('orders')
    .select('*', { count: 'exact' });
  console.log('\n=== ORDERS ===');
  console.log('Count:', totalOrders, 'Error:', oErr);
  console.log('Data:', JSON.stringify(orders, null, 2));
}

testStats().catch(console.error);
