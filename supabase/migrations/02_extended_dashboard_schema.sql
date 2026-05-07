-- Create transactions table
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('deposit', 'withdraw', 'order', 'reward', 'referral', 'bonus');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('Completed', 'Failed', 'Waiting for payment', 'In Progress');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type transaction_type NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status transaction_status DEFAULT 'Completed',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions." ON public.transactions;
CREATE POLICY "Users can view own transactions." ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own pending withdrawals." ON public.transactions;
CREATE POLICY "Users can insert own pending withdrawals." ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create referrals table
DO $$ BEGIN
    CREATE TYPE referral_status AS ENUM ('verified', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  referred_email TEXT NOT NULL,
  status referral_status DEFAULT 'pending',
  total_earned NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own referrals." ON public.referrals;
CREATE POLICY "Users can view own referrals." ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);
