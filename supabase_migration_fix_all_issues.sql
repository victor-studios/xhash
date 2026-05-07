-- Migration: Add wallet columns to profiles + ensure all required tables exist
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/eolqzluqvtzvbssyapin/sql/new)

-- 1. Add wallet setting columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wallet_network TEXT,
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- 2. Ensure orders table exists
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  package_id TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Ensure mining_history table exists
CREATE TABLE IF NOT EXISTS public.mining_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  earned NUMERIC DEFAULT 0,
  mined NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Ensure referrals table exists
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('verified', 'pending')),
  total_earned NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mining_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies — users can only read their own data
DO $$ BEGIN
  -- Orders policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view own orders') THEN
    CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can insert own orders') THEN
    CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Mining history policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mining_history' AND policyname = 'Users can view own mining history') THEN
    CREATE POLICY "Users can view own mining history" ON public.mining_history FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- Referrals policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'Users can view own referrals') THEN
    CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
  END IF;
END $$;
