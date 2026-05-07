import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { extractAdminToken } from '@/lib/admin-auth';

/**
 * GET /api/admin/stats
 * Platform overview statistics
 * 
 * Valid transaction_status enum values: 'Completed', 'Failed', 'In Progress', 'Waiting for payment'
 */
export async function GET(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminSupabaseClient();

    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // ── Deposit stats ──
    const { data: depositData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'deposit')
      .eq('status', 'Completed');
    
    const totalDeposits = depositData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // ── Withdrawal stats (only valid enum values) ──
    const { data: withdrawCompletedData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'withdraw')
      .eq('status', 'Completed');
    
    const totalWithdrawals = withdrawCompletedData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Pending withdrawals — 'In Progress' is the valid pending-like status
    const { count: pendingWithdrawals } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'withdraw')
      .eq('status', 'In Progress');

    // Pending deposits — 'Waiting for payment'
    const { count: pendingDeposits } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'deposit')
      .eq('status', 'Waiting for payment');

    // Failed transactions
    const { count: failedTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Failed');

    // ── Order stats ──
    const { count: activeOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // ── Support ──
    let openTickets = 0;
    try {
      const { count } = await supabase
        .from('support_messages')
        .select('*', { count: 'exact', head: true });
      openTickets = count || 0;
    } catch {
      // Table might not exist
    }

    // ── Recent transactions (last 5) ──
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Enrich transactions with profile data
    const txUserIds = [...new Set(recentTransactions?.map(tx => tx.user_id) || [])];
    let txProfiles: Record<string, any> = {};
    if (txUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .in('id', txUserIds);
      if (profiles) {
        profiles.forEach(p => {
          txProfiles[p.id] = p;
        });
      }
    }

    const enrichedTransactions = recentTransactions?.map(tx => ({
      ...tx,
      profiles: txProfiles[tx.user_id] || { username: 'unknown', display_name: 'Unknown User' }
    })) || [];

    // ── Recent users (last 5, sorted by actual signup date) ──
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });
    
    const sortedAuthUsers = (authUsers || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    const recentAuthUserIds = sortedAuthUsers.map(u => u.id);
    
    let recentProfilesMap: Record<string, any> = {};
    if (recentAuthUserIds.length > 0) {
      const { data: rProfiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, available_balance')
        .in('id', recentAuthUserIds);
      if (rProfiles) {
        rProfiles.forEach(p => {
          recentProfilesMap[p.id] = p;
        });
      }
    }
    
    const enrichedRecentUsers = sortedAuthUsers.map(u => {
      const p = recentProfilesMap[u.id] || {};
      return {
        id: u.id,
        email: u.email || '',
        username: p.username,
        display_name: p.display_name,
        available_balance: p.available_balance || 0,
        created_at: u.created_at,
      };
    });

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalDeposits,
      totalWithdrawals,
      pendingWithdrawals: pendingWithdrawals || 0,
      pendingDeposits: pendingDeposits || 0,
      failedTransactions: failedTransactions || 0,
      activeOrders: activeOrders || 0,
      totalOrders: totalOrders || 0,
      openTickets,
      revenue: totalDeposits - totalWithdrawals,
      recentTransactions: enrichedTransactions,
      recentUsers: enrichedRecentUsers,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
