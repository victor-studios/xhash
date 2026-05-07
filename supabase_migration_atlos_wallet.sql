-- Migration: Add crypto wallet fields to transactions and create atomic withdrawal RPC

-- 1. Add new columns to the existing transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS crypto_amount NUMERIC,
ADD COLUMN IF NOT EXISTS crypto_currency TEXT,
ADD COLUMN IF NOT EXISTS network TEXT,
ADD COLUMN IF NOT EXISTS tx_hash TEXT UNIQUE;

-- 2. Create a secure RPC function to request a withdrawal atomically
-- This ensures the user's available_balance is deducted and the pending transaction is created in a single transaction.
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  p_user_id UUID,
  p_amount NUMERIC,
  p_currency TEXT,
  p_description TEXT
) RETURNS JSONB AS $$
DECLARE
  v_balance NUMERIC;
  v_tx_id UUID;
BEGIN
  -- Lock the profile row for update to prevent race conditions
  SELECT available_balance INTO v_balance 
  FROM public.profiles 
  WHERE id = p_user_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  IF v_balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient funds');
  END IF;

  -- Deduct the balance
  UPDATE public.profiles 
  SET available_balance = available_balance - p_amount 
  WHERE id = p_user_id;

  -- Insert the pending transaction
  INSERT INTO public.transactions (user_id, type, amount, currency, status, description)
  VALUES (p_user_id, 'withdraw', p_amount, p_currency, 'In Progress', p_description)
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_tx_id, 'new_balance', v_balance - p_amount);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
