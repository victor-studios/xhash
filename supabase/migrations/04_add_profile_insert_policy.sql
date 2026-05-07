-- Add INSERT policy for profiles
-- This allows upsert operations to work correctly if a profile record doesn't exist yet
DROP POLICY IF EXISTS "Users can insert own profile." ON public.profiles;
CREATE POLICY "Users can insert own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- The SELECT and UPDATE policies should already be there from the previous script
-- But let's ensure they are correct
DROP POLICY IF EXISTS "Users can view own profile." ON public.profiles;
CREATE POLICY "Users can view own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
