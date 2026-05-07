-- Add new columns for username and display name
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update the handle_new_user trigger to populate default username/display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_username TEXT;
  new_username TEXT;
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
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
