-- RUN THIS IN SUPABASE SQL EDITOR TO FIX THE 500 ERRORS
-- This creates the missing tables: restaurant_settings and animations_settings

-- ========================================
-- 1. CREATE RESTAURANT_SETTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id SERIAL PRIMARY KEY,
  restaurant_name TEXT NOT NULL DEFAULT 'Francesco''s Pizza & Pasta',
  address TEXT NOT NULL DEFAULT '4620 Dick Pond Rd, Murrells Inlet, SC 29588',
  phone TEXT NOT NULL DEFAULT '(843) 831-0800',
  email TEXT NOT NULL DEFAULT 'francescopizzapasta@gmail.com',
  website TEXT NOT NULL DEFAULT 'https://francescospizzaandpasta.com',
  currency TEXT NOT NULL DEFAULT 'USD',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 3.99,
  minimum_order DECIMAL(10, 2) NOT NULL DEFAULT 15.00,
  auto_accept_orders BOOLEAN NOT NULL DEFAULT true,
  send_order_notifications BOOLEAN NOT NULL DEFAULT true,
  send_customer_notifications BOOLEAN NOT NULL DEFAULT true,
  out_of_stock_enabled BOOLEAN NOT NULL DEFAULT false,
  delivery_enabled BOOLEAN NOT NULL DEFAULT true,
  pickup_enabled BOOLEAN NOT NULL DEFAULT true,
  order_scheduling_enabled BOOLEAN NOT NULL DEFAULT false,
  max_advance_order_hours INTEGER NOT NULL DEFAULT 24,
  service_fee_percentage DECIMAL(5, 2) NOT NULL DEFAULT 3.50,
  service_fee_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Insert default settings if table is empty
INSERT INTO restaurant_settings (restaurant_name, address, phone, email, website)
SELECT 'Francesco''s Pizza & Pasta', '4620 Dick Pond Rd, Murrells Inlet, SC 29588', '(843) 831-0800', 'francescopizzapasta@gmail.com', 'https://francescospizzaandpasta.com'
WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings LIMIT 1);

-- ========================================
-- 2. CREATE ANIMATIONS_SETTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS animations_settings (
  id SERIAL PRIMARY KEY,
  animation_key TEXT UNIQUE NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}'::jsonb,
  pages TEXT[] DEFAULT ARRAY[]::TEXT[],
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default animations
INSERT INTO animations_settings (animation_key, is_enabled, settings, pages, start_date, end_date)
VALUES
  (
    'snow_fall',
    false,
    '{"density": 50, "speed": "medium", "color": "#ffffff"}'::jsonb,
    ARRAY['home', 'menu'],
    '2024-12-01',
    '2025-01-05'
  ),
  (
    'santa_animation',
    false,
    '{"frequency": "every_5_min", "style": "sleigh"}'::jsonb,
    ARRAY['all'],
    '2024-12-01',
    '2024-12-26'
  ),
  (
    'christmas_theme',
    false,
    '{"showLights": true, "showTree": false}'::jsonb,
    ARRAY['all'],
    '2024-12-01',
    '2025-01-01'
  ),
  (
    'advent_calendar',
    false,
    '{"year": 2024}'::jsonb,
    ARRAY['all']::TEXT[],
    NULL,
    NULL
  )
ON CONFLICT (animation_key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_animations_enabled ON animations_settings(is_enabled);

-- ========================================
-- 3. CREATE USER_VOUCHERS TABLE (required for advent_claims)
-- ========================================
CREATE TABLE IF NOT EXISTS user_vouchers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  supabase_user_id TEXT,
  reward_id INTEGER,
  voucher_code TEXT NOT NULL UNIQUE,
  discount_amount DECIMAL(10, 2) NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'fixed',
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  points_used INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  expires_at TIMESTAMP NOT NULL,
  applied_to_order_id INTEGER REFERENCES orders(id),
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP,
  title TEXT,
  description TEXT
);

-- ========================================
-- 4. CREATE ADVENT_CALENDAR TABLES (if needed)
-- ========================================
CREATE TABLE IF NOT EXISTS advent_calendar (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL UNIQUE CHECK (day >= 1 AND day <= 25),
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  reward_id INTEGER REFERENCES rewards(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS advent_claims (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  supabase_user_id TEXT,
  advent_day INTEGER NOT NULL,
  reward_id INTEGER REFERENCES rewards(id) ON DELETE CASCADE,
  voucher_id INTEGER REFERENCES user_vouchers(id) ON DELETE SET NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  claimed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, advent_day, year),
  UNIQUE(supabase_user_id, advent_day, year),
  CHECK (user_id IS NOT NULL OR supabase_user_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_advent_claims_user ON advent_claims(user_id, year);
CREATE INDEX IF NOT EXISTS idx_advent_claims_supabase_user ON advent_claims(supabase_user_id, year);
CREATE INDEX IF NOT EXISTS idx_advent_calendar_day ON advent_calendar(day, year);

-- ========================================
-- 5. UPGRADE YOUR USER TO ADMIN
-- Replace 'YOUR_EMAIL@EXAMPLE.COM' with your email
-- ========================================
-- Find your user first:
-- SELECT id, email, role, username FROM users WHERE email ILIKE '%YOUR_EMAIL%';

-- Then update to admin (replace the email with yours):
UPDATE users SET role = 'admin' WHERE email = 'YOUR_EMAIL@EXAMPLE.COM';

-- Or if you know your Supabase user ID:
-- UPDATE users SET role = 'admin' WHERE supabase_user_id = 'YOUR_SUPABASE_USER_ID';

-- Verify the update:
SELECT id, email, role, username FROM users WHERE role = 'admin';

-- ========================================
-- DONE! Refresh your browser after running this.
-- ========================================
SELECT 'Tables created and admin updated!' as status;
