-- Migration: Create atomic purchase_mining_plan RPC function
-- This ensures balance deduction, order creation, and transaction logging happen atomically.

CREATE OR REPLACE FUNCTION public.purchase_mining_plan(
  p_user_id UUID,
  p_package_slug TEXT,
  p_price NUMERIC,
  p_quantity INT,
  p_description TEXT
) RETURNS JSONB AS $$
DECLARE
  v_balance NUMERIC;
  v_total_cost NUMERIC;
  v_new_balance NUMERIC;
  v_tx_id UUID;
  i INT;
BEGIN
  v_total_cost := p_price * p_quantity;

  -- Lock the profile row for update to prevent race conditions
  SELECT available_balance INTO v_balance 
  FROM public.profiles 
  WHERE id = p_user_id 
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  IF v_balance < v_total_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'Insufficient funds');
  END IF;

  v_new_balance := v_balance - v_total_cost;

  -- Deduct the balance
  UPDATE public.profiles 
  SET available_balance = v_new_balance 
  WHERE id = p_user_id;

  -- Create order(s)
  FOR i IN 1..p_quantity LOOP
    INSERT INTO public.orders (user_id, package_id, amount, status)
    VALUES (p_user_id, p_package_slug, p_price, 'active');
  END LOOP;

  -- Update available slots for the mining plan
  UPDATE public.mining_plans
  SET slots_available = slots_available - p_quantity
  WHERE slug = p_package_slug AND slots_available >= p_quantity;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not enough slots available');
  END IF;

  -- Insert the transaction record
  INSERT INTO public.transactions (user_id, type, amount, currency, status, description)
  VALUES (p_user_id, 'order', v_total_cost, 'USD', 'Completed', p_description)
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object(
    'success', true, 
    'transaction_id', v_tx_id, 
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
