-- Migration: Create automated daily earnings processor
-- This function calculates daily returns for active mining orders and handles contract expirations.

CREATE OR REPLACE FUNCTION public.process_daily_earnings()
RETURNS void AS $$
DECLARE
  v_user record;
  v_daily_total numeric;
  v_order record;
BEGIN
  -- 1. PROCESS DAILY EARNINGS
  -- We aggregate all active orders per user to issue a single combined transaction.
  FOR v_user IN (
    SELECT 
      o.user_id,
      SUM((mp.total_return - mp.price) / (mp.duration_months * 30)) as total_daily_profit
    FROM public.orders o
    JOIN public.mining_plans mp ON o.package_id = mp.slug
    WHERE o.status = 'active'
    GROUP BY o.user_id
  ) LOOP
    
    -- Add daily profit to user's balance and total earned
    UPDATE public.profiles
    SET 
      available_balance = available_balance + v_user.total_daily_profit,
      total_earned = total_earned + v_user.total_daily_profit,
      daily_return = v_user.total_daily_profit -- Updates the last calculated daily return
    WHERE id = v_user.user_id;

    -- Insert a single transaction record for the daily earnings
    INSERT INTO public.transactions (user_id, type, amount, currency, status, description)
    VALUES (
      v_user.user_id, 
      'mining_return', 
      v_user.total_daily_profit, 
      'USD', 
      'Completed', 
      'Daily mining payout for active contracts'
    );
  END LOOP;

  -- 2. PROCESS CONTRACT EXPIRATIONS
  -- Find all orders that have passed their duration date
  FOR v_order IN (
    SELECT 
      o.id as order_id,
      o.user_id,
      o.package_id,
      o.amount as principal_amount,
      mp.name as package_name
    FROM public.orders o
    JOIN public.mining_plans mp ON o.package_id = mp.slug
    WHERE o.status = 'active'
      AND now() >= (o.created_at + (mp.duration_months || ' months')::interval)
  ) LOOP
    
    -- Mark order as expired
    UPDATE public.orders
    SET status = 'expired'
    WHERE id = v_order.order_id;

    -- Return the principal amount to the user's available balance
    UPDATE public.profiles
    SET available_balance = available_balance + v_order.principal_amount
    WHERE id = v_order.user_id;

    -- Insert a transaction record for the returned principal
    INSERT INTO public.transactions (user_id, type, amount, currency, status, description)
    VALUES (
      v_order.user_id, 
      'principal_return', 
      v_order.principal_amount, 
      'USD', 
      'Completed', 
      'Principal returned for expired ' || v_order.package_name || ' contract'
    );
  END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =====================================================================================
-- HOW TO SCHEDULE THIS FUNCTION:
-- If your Supabase project is on the Pro plan or has pg_cron enabled, run the following:
-- =====================================================================================
-- SELECT cron.schedule(
--   'daily-mining-payouts',
--   '0 8 * * *', -- Runs every day at 08:00 AM
--   $$ SELECT public.process_daily_earnings(); $$
-- );
-- =====================================================================================
