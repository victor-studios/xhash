import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { extractAdminToken } from '@/lib/admin-auth';

/**
 * GET /api/admin/stats
 * Platform overview statistics
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

    // Total deposits
    const { data: depositData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'deposit')
      .eq('status', 'Completed');
    
    const totalDeposits = depositData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Total withdrawals
    const { data: withdrawData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'withdraw')
      .in('status', ['Completed', 'Confirmed']);
    
    const totalWithdrawals = withdrawData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    // Pending withdrawals
    const { count: pendingWithdrawals } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'withdraw')
      .in('status', ['Pending', 'Processing', 'In Progress']);

    // Active orders
    const { count: activeOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Open support tickets
    const { count: openTickets } = await supabase
      .from('support_messages')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress']);

    // Recent transactions (last 10)
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

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
      profiles: txProfiles[tx.user_id] || { username: 'Unknown', display_name: 'Unknown User' }
    })) || [];

    // Recent users (last 5)
    // Fetch auth users to get true created_at
    const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });
    
    const sortedAuthUsers = (authUsers || []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const recentAuthUsers = sortedAuthUsers.slice(0, 5);
    const recentAuthUserIds = recentAuthUsers.map(u => u.id);
    
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
    
    const enrichedRecentUsers = recentAuthUsers.map(u => {
      const p = recentProfilesMap[u.id] || {};
      return {
        id: u.id,
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
      activeOrders: activeOrders || 0,
      totalOrders: totalOrders || 0,
      openTickets: openTickets || 0,
      revenue: totalDeposits - totalWithdrawals,
      recentTransactions: enrichedTransactions,
      recentUsers: enrichedRecentUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
