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
      .select('*, profiles!transactions_user_id_fkey(username, display_name)')
      .order('created_at', { ascending: false })
      .limit(10);

    // Recent users (last 5)
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('id, username, display_name, available_balance')
      .limit(5);

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalDeposits,
      totalWithdrawals,
      pendingWithdrawals: pendingWithdrawals || 0,
      activeOrders: activeOrders || 0,
      totalOrders: totalOrders || 0,
      openTickets: openTickets || 0,
      revenue: totalDeposits - totalWithdrawals,
      recentTransactions: recentTransactions || [],
      recentUsers: recentUsers || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
