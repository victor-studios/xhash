import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { extractAdminToken, hasPermission } from '@/lib/admin-auth';

/**
 * GET /api/admin/users
 * List all users with profile data (Level 1, 2)
 */
export async function GET(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 2)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    const { data: users, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get emails and created_at from auth.users for each profile
    const userIds = users?.map(u => u.id) || [];
    let authDataMap: Record<string, any> = {};
    
    if (userIds.length > 0) {
      const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({
        perPage: 1000,
      });
      
      if (authUsers) {
        authUsers.forEach(u => {
          authDataMap[u.id] = {
            email: u.email || '',
            created_at: u.created_at || new Date().toISOString()
          };
        });
      }
    }

    const enrichedUsers = users?.map(u => ({
      ...u,
      email: authDataMap[u.id]?.email || 'N/A',
      created_at: authDataMap[u.id]?.created_at || new Date().toISOString()
    })) || [];

    return NextResponse.json({
      users: enrichedUsers,
      total: count || 0,
      page,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/users
 * Update a user's profile (Level 1 only)
 * Actions: adjust_balance, toggle_status
 */
export async function PATCH(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const { userId, action, value } = await req.json();
    const supabase = createAdminSupabaseClient();

    if (action === 'adjust_balance') {
      const amount = parseFloat(value);
      if (isNaN(amount)) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      }

      // Get current balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('available_balance, total_deposit')
        .eq('id', userId)
        .single();

      if (!profile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const newBalance = Number(profile.available_balance) + amount;
      const newTotalDeposit = Number(profile.total_deposit) + (amount > 0 ? amount : 0);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          available_balance: newBalance,
          total_deposit: newTotalDeposit,
        })
        .eq('id', userId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // Create a transaction record
      await supabase.from('transactions').insert({
        user_id: userId,
        type: amount > 0 ? 'deposit' : 'withdraw',
        amount: Math.abs(amount),
        currency: 'USD (Admin)',
        status: 'Completed',
        description: `Admin adjustment by ${admin.username}`,
      });

      // Log activity
      await supabase.from('admin_activity_log').insert({
        admin_id: admin.adminId,
        admin_username: admin.username,
        action: 'adjust_balance',
        details: { userId, amount, newBalance },
        target_user_id: userId,
      });

      return NextResponse.json({ message: 'Balance updated', newBalance });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users
 * Delete a user (Level 1 only)
 */
export async function DELETE(req: NextRequest) {
  const admin = extractAdminToken(req.headers.get('authorization'));
  if (!admin || !hasPermission(admin.level, 1)) {
    return NextResponse.json({ error: 'Unauthorized — Level 1 required' }, { status: 403 });
  }

  try {
    const { userId } = await req.json();
    const supabase = createAdminSupabaseClient();

    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Log activity
    await supabase.from('admin_activity_log').insert({
      admin_id: admin.adminId,
      admin_username: admin.username,
      action: 'delete_user',
      details: { userId },
      target_user_id: userId,
    });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
