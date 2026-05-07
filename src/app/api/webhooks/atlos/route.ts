import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fallback prices in case CoinGecko API fails
const FALLBACK_PRICES: Record<string, number> = {
  btc: 60000,
  eth: 3000,
  sol: 150,
  ada: 0.5,
  trx: 0.12,
  ltc: 80,
  usdt: 1,
  usdc: 1,
};

async function getCryptoPriceUsd(coinId: string): Promise<number> {
  const idMap: Record<string, string> = {
    btc: 'bitcoin',
    eth: 'ethereum',
    sol: 'solana',
    ada: 'cardano',
    trx: 'tron',
    ltc: 'litecoin',
    usdt: 'tether',
    usdc: 'usd-coin',
  };

  const id = idMap[coinId.toLowerCase()];
  if (!id) return 1;

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch price');
    const data = await res.json();
    return data[id]?.usd || FALLBACK_PRICES[coinId.toLowerCase()] || 1;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return FALLBACK_PRICES[coinId.toLowerCase()] || 1;
  }
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('X-Webhook-Signature');
    const timestamp = req.headers.get('X-Webhook-Timestamp');
    
    const secret = process.env.ATLOS_WEBHOOK_SECRET;
    
    const body = await req.text();
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    if (secret && signature && timestamp) {
      const tolerance = 300;
      const now = Math.floor(Date.now() / 1000);
      const ts = parseInt(timestamp, 10);
      
      if (Math.abs(now - ts) > tolerance) {
        return NextResponse.json({ error: 'Webhook timestamp too old' }, { status: 400 });
      }

      const message = `${timestamp}.${body}`;
      const expectedHash = crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('hex');

      if (expectedHash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Missing signature headers' }, { status: 401 });
    }

    // ATLOS uses PascalCase field names: OrderId, Amount, AssetCode, Txid, Status, BlockchainCode
    // We also accept lowercase variants as fallback for flexibility
    const userId = payload.OrderId || payload.orderId || payload.custom_id;
    const paymentStatus = payload.Status || payload.status;
    const paymentAmount = payload.Amount || payload.amount;
    const assetCode = payload.AssetCode || payload.currency || payload.assetCode;
    const txHash = payload.Txid || payload.txid || payload.tx_hash;
    const networkCode = payload.BlockchainCode || payload.network || payload.blockchainCode;

    // ATLOS uses numeric status codes: 100 = confirmed/completed
    const isCompleted = paymentStatus === 100 || paymentStatus === 'completed' || paymentStatus === 'confirmed';
    if (!isCompleted) {
      return NextResponse.json({ message: 'Ignored non-completed status' }, { status: 200 });
    }

    if (!userId || !paymentAmount || !assetCode) {
      return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 });
    }

    if (txHash) {
      const { data: existingTx } = await supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('tx_hash', txHash)
        .single();
      
      if (existingTx) {
        return NextResponse.json({ message: 'Transaction already processed' }, { status: 200 });
      }
    }

    const priceUsd = await getCryptoPriceUsd(assetCode);
    const amountUsd = parseFloat(paymentAmount) * priceUsd;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('available_balance, total_deposit')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const newBalance = Number(profile.available_balance || 0) + amountUsd;
    const newTotalDeposit = Number(profile.total_deposit || 0) + amountUsd;

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        available_balance: newBalance,
        total_deposit: newTotalDeposit
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'deposit',
        amount: amountUsd,
        currency: 'USD',
        crypto_amount: paymentAmount,
        crypto_currency: assetCode.toUpperCase(),
        network: networkCode || assetCode.toUpperCase(),
        tx_hash: txHash || `manual_${Date.now()}`,
        status: 'Completed',
        description: `Deposit of ${paymentAmount} ${assetCode.toUpperCase()}`
      });

    if (txError) console.error('Failed to insert transaction log:', txError);

    return NextResponse.json({ success: true, credited_usd: amountUsd }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
