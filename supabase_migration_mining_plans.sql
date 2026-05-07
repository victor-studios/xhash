CREATE TABLE public.mining_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  subtitle text,
  crypto text NOT NULL,
  crypto_icon text NOT NULL,
  crypto_color text NOT NULL,
  duration_months integer NOT NULL,
  price numeric NOT NULL,
  total_return numeric NOT NULL,
  slots_total integer NOT NULL DEFAULT 100,
  slots_available integer NOT NULL DEFAULT 100,
  is_sold_out boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.mining_plans ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public read access to mining_plans" 
ON public.mining_plans FOR SELECT 
TO public
USING (true);

-- Insert Initial Data (5 coins x 3 plans)
INSERT INTO public.mining_plans (slug, name, crypto, crypto_icon, crypto_color, duration_months, price, total_return) VALUES
-- Bitcoin
('bitcoin-1m', 'Bitcoin Mining', 'BTC', '₿', '#F7931A', 1, 1000, 1250),
('bitcoin-3m', 'Bitcoin Mining', 'BTC', '₿', '#F7931A', 3, 1000, 2000),
('bitcoin-6m', 'Bitcoin Mining', 'BTC', '₿', '#F7931A', 6, 1000, 3500),
-- Ethereum
('ethereum-1m', 'Ethereum Mining', 'ETH', '⟠', '#627EEA', 1, 600, 750),
('ethereum-3m', 'Ethereum Mining', 'ETH', '⟠', '#627EEA', 3, 600, 1200),
('ethereum-6m', 'Ethereum Mining', 'ETH', '⟠', '#627EEA', 6, 600, 2100),
-- Litecoin
('litecoin-1m', 'Litecoin Mining', 'LTC', 'Ł', '#345D9D', 1, 300, 375),
('litecoin-3m', 'Litecoin Mining', 'LTC', 'Ł', '#345D9D', 3, 300, 600),
('litecoin-6m', 'Litecoin Mining', 'LTC', 'Ł', '#345D9D', 6, 300, 1050),
-- Dashcoin
('dashcoin-1m', 'Dashcoin Mining', 'DASH', 'Đ', '#008CE7', 1, 100, 125),
('dashcoin-3m', 'Dashcoin Mining', 'DASH', 'Đ', '#008CE7', 3, 100, 200),
('dashcoin-6m', 'Dashcoin Mining', 'DASH', 'Đ', '#008CE7', 6, 100, 350),
-- Filecoin
('filecoin-1m', 'Filecoin Mining', 'FIL', '⨎', '#0090FF', 1, 50, 62.5),
('filecoin-3m', 'Filecoin Mining', 'FIL', '⨎', '#0090FF', 3, 50, 100),
('filecoin-6m', 'Filecoin Mining', 'FIL', '⨎', '#0090FF', 6, 50, 175);
