import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } }
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, wallet, description, password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required to confirm withdrawal' }, { status: 400 });
    }

    // Verify password by attempting to sign in with a fresh anon client
    const tempClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { error: passwordError } = await tempClient.auth.signInWithPassword({
      email: user.email!,
      password: password
    });

    if (passwordError) {
      return NextResponse.json({ error: 'Invalid password. Withdrawal denied.' }, { status: 401 });
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < 10) {
      return NextResponse.json({ error: 'Minimum withdrawal amount is $10' }, { status: 400 });
    }
    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Call the secure RPC function to deduct balance and create transaction atomically
    const { data, error } = await supabaseClient.rpc('request_withdrawal', {
      p_user_id: user.id,
      p_amount: numAmount,
      p_currency: wallet,
      p_description: description || `Withdrawal request to ${wallet}`
    });

    if (error) {
      console.error('RPC Error:', error);
      return NextResponse.json({ error: 'Failed to process withdrawal request' }, { status: 500 });
    }

    if (!data.success) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      transaction_id: data.transaction_id, 
      new_balance: data.new_balance 
    }, { status: 200 });

  } catch (error) {
    console.error('Withdraw API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
