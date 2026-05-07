-- Migration: Create atomic process_deposit RPC function
-- Called by the Atlos webhook to credit user balances after a confirmed crypto deposit.

CREATE OR REPLACE FUNCTION public.process_deposit(
  p_user_id UUID,
  p_amount_usd NUMERIC,
  p_crypto_amount NUMERIC,
  p_crypto_currency TEXT,
  p_network TEXT,
  p_tx_hash TEXT,
  p_description TEXT
) RETURNS JSONB AS $$
DECLARE
  v_tx_id UUID;
  v_new_balance NUMERIC;
BEGIN
  -- Lock the profile row for update to prevent race conditions
  SELECT available_balance INTO v_new_balance
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  v_new_balance := v_new_balance + p_amount_usd;

  -- Update user's balance and total deposit
  UPDATE public.profiles
  SET available_balance = v_new_balance,
      total_deposit = total_deposit + p_amount_usd
  WHERE id = p_user_id;

  -- Insert the completed deposit transaction
  INSERT INTO public.transactions (
    user_id, type, amount, currency, status, description,
    crypto_amount, crypto_currency, network, tx_hash
  )
  VALUES (
    p_user_id, 'deposit', p_amount_usd, 'USD', 'Completed', p_description,
    p_crypto_amount, p_crypto_currency, p_network, p_tx_hash
  )
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_tx_id,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
