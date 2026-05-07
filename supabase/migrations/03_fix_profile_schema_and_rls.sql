-- Add missing columns to profiles table if they don't exist
DO $$ 
BEGIN
    -- Add wallet_network
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='wallet_network') THEN
        ALTER TABLE public.profiles ADD COLUMN wallet_network TEXT;
    END IF;
    
    -- Add wallet_address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='wallet_address') THEN
        ALTER TABLE public.profiles ADD COLUMN wallet_address TEXT;
    END IF;
    
    -- Add username
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='username') THEN
        ALTER TABLE public.profiles ADD COLUMN username TEXT;
        -- Add unique constraint separately to be safe
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
    END IF;
    
    -- Add display_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='display_name') THEN
        ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
    END IF;
END $$;

-- Add UPDATE policy for profiles if it doesn't exist
-- This is CRITICAL for saving withdraw settings and profile details
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
