-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  available_balance NUMERIC DEFAULT 0,
  total_deposit NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  total_withdrawn NUMERIC DEFAULT 0,
  hash_rate NUMERIC DEFAULT 0,
  active_miners INTEGER DEFAULT 0,
  daily_return NUMERIC DEFAULT 0,
  affiliate_earned NUMERIC DEFAULT 0,
  rewards_earned NUMERIC DEFAULT 0,
  affiliate_code TEXT UNIQUE
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists to avoid errors on reruns
DROP POLICY IF EXISTS "Users can view own profile." ON public.profiles;
CREATE POLICY "Users can view own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Create orders table
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('active', 'expired', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  package_id TEXT NOT NULL,
  status order_status DEFAULT 'pending',
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders." ON public.orders;
CREATE POLICY "Users can view own orders." ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Create mining history table
CREATE TABLE IF NOT EXISTS public.mining_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  earned NUMERIC DEFAULT 0,
  mined NUMERIC DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.mining_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own mining history." ON public.mining_history;
CREATE POLICY "Users can view own mining history." ON public.mining_history
  FOR SELECT USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, affiliate_code)
  VALUES (
    new.id, 
    -- simple unique random string for affiliate code
    substring(md5(random()::text) from 1 for 8)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
