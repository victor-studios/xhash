import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { extractAdminToken, hasPermission } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/transactions
 * List all transactions with filters (Level 1, 2)
 */
export async function GET(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 2)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || ''; // 'deposit' or 'withdraw'
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination last
    query = query.range(offset, offset + limit - 1);

    const { data: transactions, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with user info
    const userIds = [...new Set(transactions?.map(t => t.user_id) || [])];
    let userMap: Record<string, any> = {};

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, display_name, wallet_address, wallet_network')
        .in('id', userIds);

      if (profiles) {
        profiles.forEach(p => {
          userMap[p.id] = p;
        });
      }
    }

    const enrichedTransactions = transactions?.map(t => ({
      ...t,
      user: userMap[t.user_id] || { username: 'Unknown', display_name: 'Unknown' },
    })) || [];

    return NextResponse.json({
      transactions: enrichedTransactions,
      total: count || 0,
      page,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/transactions
 * Approve/reject withdrawals (Level 1, 2)
 */
export async function PATCH(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 2)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { transactionId, action } = await req.json();
    const supabase = createAdminSupabaseClient();

    // Fetch the transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.type !== 'withdraw') {
      return NextResponse.json({ error: 'Can only approve/reject withdrawals' }, { status: 400 });
    }

    let newStatus = '';
    if (action === 'approve') {
      newStatus = 'Completed';
    } else if (action === 'reject') {
      newStatus = 'Rejected';
    } else {
      return NextResponse.json({ error: 'Invalid action. Use approve or reject.' }, { status: 400 });
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ status: newStatus })
      .eq('id', transactionId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // If rejected, refund the amount back to user's balance
    if (action === 'reject') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('available_balance, total_withdrawn')
        .eq('id', transaction.user_id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            available_balance: Number(profile.available_balance) + Number(transaction.amount),
            total_withdrawn: Math.max(0, Number(profile.total_withdrawn) - Number(transaction.amount)),
          })
          .eq('id', transaction.user_id);
      }
    }

    // Log activity
    await supabase.from('admin_activity_log').insert({
      admin_id: admin.adminId,
      admin_username: admin.username,
      action: `withdrawal_${action}`,
      details: { transactionId, amount: transaction.amount, userId: transaction.user_id },
      target_user_id: transaction.user_id,
    });

    return NextResponse.json({ message: `Withdrawal ${action}d successfully`, newStatus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
