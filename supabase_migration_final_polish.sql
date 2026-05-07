-- Migration: Final Production Polish & RLS Security Fixes
-- Run this in the Supabase SQL Editor

-- 1. Fix Profiles RLS: Allow users to update their own profile
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- 2. Update handle_new_user trigger to handle referrals from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  new_username TEXT;
  v_referrer_id UUID;
  v_affiliate_code TEXT;
BEGIN
  -- Generate a random base username
  base_username := 'user_' || substring(md5(random()::text) from 1 for 6);
  new_username := base_username;

  -- Insert into profiles with defaults
  INSERT INTO public.profiles (id, affiliate_code, username, display_name)
  VALUES (
    new.id, 
    substring(md5(random()::text) from 1 for 8),
    new_username,
    'User ' || substring(md5(random()::text) from 1 for 4)
  )
  ON CONFLICT (id) DO NOTHING;

  -- Handle Referral if affiliate_code was provided in metadata
  v_affiliate_code := new.raw_user_meta_data->>'affiliate_code';
  
  IF v_affiliate_code IS NOT NULL THEN
    -- Find referrer by their affiliate_code
    SELECT id INTO v_referrer_id FROM public.profiles WHERE affiliate_code = v_affiliate_code;
    
    IF v_referrer_id IS NOT NULL AND v_referrer_id != new.id THEN
      -- Create referral record
      INSERT INTO public.referrals (referrer_id, referred_email, status)
      VALUES (v_referrer_id, new.email, 'pending');
    END IF;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Automatic Referral Commission Trigger
CREATE OR REPLACE FUNCTION public.handle_referral_commission()
RETURNS trigger AS $$
DECLARE
  v_referrer_id UUID;
  v_commission_rate NUMERIC := 0.045; -- 4.5%
  v_commission_amount NUMERIC;
BEGIN
  -- 1. Check if the purchase is NOT "Primary Mining" ($10)
  -- If amount is 10, we ignore it as per platform rules.
  IF NEW.amount <= 10 THEN
    RETURN NEW;
  END IF;

  -- 2. Find if this user was referred by someone
  -- We match the user's email with the referrals table
  SELECT referrer_id INTO v_referrer_id 
  FROM public.referrals 
  WHERE referred_email = (SELECT email FROM auth.users WHERE id = NEW.user_id)
  LIMIT 1;

  IF v_referrer_id IS NOT NULL THEN
    v_commission_amount := NEW.amount * v_commission_rate;

    -- 3. Update Referrer's balance and affiliate_earned
    UPDATE public.profiles 
    SET available_balance = available_balance + v_commission_amount,
        affiliate_earned = affiliate_earned + v_commission_amount
    WHERE id = v_referrer_id;

    -- 4. Update referral record to verified and add to total_earned
    UPDATE public.referrals 
    SET status = 'verified',
        total_earned = total_earned + v_commission_amount
    WHERE referrer_id = v_referrer_id 
    AND referred_email = (SELECT email FROM auth.users WHERE id = NEW.user_id);

    -- 5. Log a transaction for the referrer
    INSERT INTO public.transactions (user_id, type, amount, currency, status, description)
    VALUES (v_referrer_id, 'referral', v_commission_amount, 'USD', 'Completed', 'Referral commission from purchase');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for referral commission on order insertion
DROP TRIGGER IF EXISTS on_order_created_commission ON public.orders;
CREATE TRIGGER on_order_created_commission
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.handle_referral_commission();

-- 4. Ensure all numeric columns have appropriate defaults
ALTER TABLE public.profiles 
ALTER COLUMN available_balance SET DEFAULT 0,
ALTER COLUMN total_deposit SET DEFAULT 0,
ALTER COLUMN total_earned SET DEFAULT 0,
ALTER COLUMN total_withdrawn SET DEFAULT 0,
ALTER COLUMN affiliate_earned SET DEFAULT 0;

-- 5. RLS Policies (Double check)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can view own transactions.') THEN
    CREATE POLICY "Users can view own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mining_plans' AND policyname = 'Allow public read access to mining_plans') THEN
    CREATE POLICY "Allow public read access to mining_plans" ON public.mining_plans FOR SELECT TO public USING (true);
  END IF;
END $$;
