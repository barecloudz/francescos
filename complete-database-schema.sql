-- Complete Database Schema for Digital Pizza App
-- Run this in your new Supabase SQL Editor to create all tables

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"address" text,
	"city" text,
	"state" text,
	"zip_code" text,
	"role" text DEFAULT 'customer' NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"rewards" integer DEFAULT 0 NOT NULL,
	"stripe_customer_id" text,
	"marketing_opt_in" boolean DEFAULT true NOT NULL,
	"supabase_user_id" text,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id) WHERE supabase_user_id IS NOT NULL;

-- Categories table
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"image_url" text,
	"half_and_half_enabled" boolean DEFAULT false,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);

-- Menu Items table
CREATE TABLE IF NOT EXISTS "menu_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"base_price" numeric(10, 2) NOT NULL,
	"category" text NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_new" boolean DEFAULT false NOT NULL,
	"is_best_seller" boolean DEFAULT false NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"options" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Choice Groups table
CREATE TABLE IF NOT EXISTS "choice_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"max_selections" integer,
	"min_selections" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"priority" integer DEFAULT 0
);

-- Choice Items table
CREATE TABLE IF NOT EXISTS "choice_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"choice_group_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_available" boolean DEFAULT true
);

-- Category Choice Groups (links categories to choice groups)
CREATE TABLE IF NOT EXISTS "category_choice_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_name" text NOT NULL,
	"choice_group_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Menu Item Choice Groups (links menu items to choice groups)
CREATE TABLE IF NOT EXISTS "menu_item_choice_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"menu_item_id" integer NOT NULL,
	"choice_group_id" integer NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- =====================================================
-- ORDER TABLES
-- =====================================================

-- Orders table
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"status" text DEFAULT 'pending' NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) NOT NULL,
	"delivery_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
	"tip" numeric(10, 2) DEFAULT '0' NOT NULL,
	"order_type" text NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_intent_id" text,
	"special_instructions" text,
	"address" text,
	"address_data" jsonb,
	"shipday_order_id" text,
	"shipday_status" text,
	"fulfillment_time" text DEFAULT 'asap',
	"scheduled_time" timestamp,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"completed_at" timestamp,
	"supabase_user_id" text,
	"customer_name" text,
	"promo_code" text,
	"customer_email" text,
	"service_fee" numeric(10, 2) DEFAULT '0',
	"card_fee" numeric(10, 2) DEFAULT '0'
);

CREATE INDEX IF NOT EXISTS idx_orders_supabase_user_id ON orders(supabase_user_id) WHERE supabase_user_id IS NOT NULL;

-- Order Items table
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"menu_item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"options" jsonb,
	"special_instructions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"half_and_half_data" jsonb
);

-- Order Refunds table
CREATE TABLE IF NOT EXISTS order_refunds (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    refund_id TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'succeeded',
    created_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES users(id)
);

-- =====================================================
-- REWARDS & POINTS TABLES
-- =====================================================

-- Loyalty Program table
CREATE TABLE IF NOT EXISTS "loyalty_program" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT 'Loyalty Program' NOT NULL,
	"description" text,
	"points_per_dollar" numeric(10, 2) DEFAULT '1.00' NOT NULL,
	"bonus_points_threshold" numeric(10, 2) DEFAULT '50.00' NOT NULL,
	"bonus_points_multiplier" numeric(10, 2) DEFAULT '1.50' NOT NULL,
	"points_for_signup" integer DEFAULT 100 NOT NULL,
	"points_for_first_order" integer DEFAULT 50 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Points Rewards table
CREATE TABLE IF NOT EXISTS "points_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"points_required" integer NOT NULL,
	"reward_type" text NOT NULL,
	"reward_value" numeric(10, 2),
	"reward_description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"max_redemptions" integer,
	"current_redemptions" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"free_item_category" text,
	"free_item_max_value" numeric(10, 2),
	"discount_type" text,
	"discount_value" numeric(10, 2),
	"advent_only" boolean DEFAULT false
);

-- User Points table
CREATE TABLE IF NOT EXISTS "user_points" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"points" integer DEFAULT 0 NOT NULL,
	"total_earned" integer DEFAULT 0 NOT NULL,
	"total_redeemed" integer DEFAULT 0 NOT NULL,
	"last_earned_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"supabase_user_id" text,
	CONSTRAINT user_points_unique_user UNIQUE (user_id),
	CONSTRAINT user_points_unique_supabase UNIQUE (supabase_user_id)
);

-- Points Transactions table
CREATE TABLE IF NOT EXISTS "points_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"order_id" integer,
	"type" text NOT NULL,
	"points" integer NOT NULL,
	"description" text NOT NULL,
	"order_amount" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"supabase_user_id" text
);

-- User Points Redemptions table
CREATE TABLE IF NOT EXISTS "user_points_redemptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"points_reward_id" integer NOT NULL,
	"order_id" integer,
	"points_spent" integer NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"supabase_user_id" text
);

-- Rewards table
CREATE TABLE IF NOT EXISTS "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"discount" numeric(10, 2),
	"discount_type" text,
	"min_order_amount" numeric(10, 2),
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- User Rewards table
CREATE TABLE IF NOT EXISTS "user_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"reward_id" integer NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Voucher Codes table
CREATE TABLE IF NOT EXISTS voucher_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'free_item')),
    discount_value DECIMAL(10, 2),
    free_item_category VARCHAR(100),
    free_item_max_value DECIMAL(10, 2),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    max_uses_per_user INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Voucher Redemptions table
CREATE TABLE IF NOT EXISTS voucher_redemptions (
    id SERIAL PRIMARY KEY,
    voucher_id INTEGER REFERENCES voucher_codes(id),
    user_id INTEGER REFERENCES users(id),
    supabase_user_id TEXT,
    order_id INTEGER REFERENCES orders(id),
    discount_applied DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Promo Codes table
CREATE TABLE IF NOT EXISTS "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"discount" numeric(10, 2) NOT NULL,
	"discount_type" text NOT NULL,
	"min_order_amount" numeric(10, 2) NOT NULL,
	"max_uses" integer NOT NULL,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);

-- =====================================================
-- SETTINGS TABLES
-- =====================================================

-- Restaurant Settings table
CREATE TABLE IF NOT EXISTS "restaurant_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_name" text DEFAULT 'Pizza Restaurant' NOT NULL,
	"address" text DEFAULT '123 Main Street' NOT NULL,
	"phone" text DEFAULT '(555) 123-4567' NOT NULL,
	"email" text DEFAULT 'info@restaurant.com' NOT NULL,
	"website" text DEFAULT 'https://restaurant.com' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"timezone" text DEFAULT 'America/New_York' NOT NULL,
	"delivery_fee" numeric(10, 2) DEFAULT '3.99' NOT NULL,
	"minimum_order" numeric(10, 2) DEFAULT '15.00' NOT NULL,
	"auto_accept_orders" boolean DEFAULT true NOT NULL,
	"send_order_notifications" boolean DEFAULT true NOT NULL,
	"send_customer_notifications" boolean DEFAULT true NOT NULL,
	"out_of_stock_enabled" boolean DEFAULT false NOT NULL,
	"delivery_enabled" boolean DEFAULT true NOT NULL,
	"pickup_enabled" boolean DEFAULT true NOT NULL,
	"order_scheduling_enabled" boolean DEFAULT false NOT NULL,
	"max_advance_order_hours" integer DEFAULT 24 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Store Hours table
CREATE TABLE IF NOT EXISTS "store_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_of_week" integer NOT NULL,
	"day_name" text NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"open_time" text,
	"close_time" text,
	"is_break_time" boolean DEFAULT false NOT NULL,
	"break_start_time" text,
	"break_end_time" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'text',
    category TEXT DEFAULT 'general',
    display_name TEXT NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT false,
    options JSONB,
    validation_pattern TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

-- Tax Categories table
CREATE TABLE IF NOT EXISTS "tax_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"rate" numeric(5, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"applies_to_delivery" boolean DEFAULT false NOT NULL,
	"applies_to_tips" boolean DEFAULT false NOT NULL,
	"applies_to_service_fees" boolean DEFAULT false NOT NULL,
	"applies_to_menu_items" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Tax Settings table
CREATE TABLE IF NOT EXISTS "tax_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"tax_application" text DEFAULT 'on_top' NOT NULL,
	"tax_name" text DEFAULT 'Sales Tax' NOT NULL,
	"default_tax_category_id" integer,
	"delivery_fee_tax_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"tips_tax_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"service_fee_tax_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"currency_symbol" text DEFAULT '$' NOT NULL,
	"currency_position" text DEFAULT 'before' NOT NULL,
	"decimal_places" integer DEFAULT 2 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- =====================================================
-- DELIVERY TABLES
-- =====================================================

-- Store Settings (for delivery calculations)
CREATE TABLE IF NOT EXISTS store_settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL DEFAULT 'Pizza Restaurant',
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Delivery Zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id SERIAL PRIMARY KEY,
  zone_name VARCHAR(100) NOT NULL,
  min_distance_miles DECIMAL(4, 2) NOT NULL DEFAULT 0.0,
  max_distance_miles DECIMAL(4, 2) NOT NULL,
  delivery_fee DECIMAL(6, 2) NOT NULL,
  estimated_time_minutes INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_zones_distance ON delivery_zones(min_distance_miles, max_distance_miles);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_active ON delivery_zones(is_active);

-- Delivery Blackouts table
CREATE TABLE IF NOT EXISTS delivery_blackouts (
  id SERIAL PRIMARY KEY,
  area_name VARCHAR(255) NOT NULL,
  zip_codes TEXT[],
  reason VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CATERING TABLES
-- =====================================================

-- Catering Inquiries table
CREATE TABLE IF NOT EXISTS catering_inquiries (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    custom_event_type VARCHAR(255),
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('pickup', 'delivery')),
    event_address TEXT,
    event_date DATE,
    event_time TIME,
    special_delivery_instructions TEXT,
    guest_count VARCHAR(20) NOT NULL,
    custom_guest_count INTEGER,
    menu_style VARCHAR(50) NOT NULL,
    dietary_restrictions JSONB DEFAULT '[]',
    budget_range VARCHAR(50),
    additional_services JSONB DEFAULT '[]',
    special_requests TEXT,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    preferred_contact VARCHAR(20),
    best_time_to_call VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_catering_inquiries_status ON catering_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_catering_inquiries_created_at ON catering_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_catering_inquiries_event_date ON catering_inquiries(event_date);

-- Catering Menu Categories table
CREATE TABLE IF NOT EXISTS catering_menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Catering Packages table
CREATE TABLE IF NOT EXISTS catering_packages (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES catering_menu(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    serves VARCHAR(50),
    price DECIMAL(10, 2),
    price_per_person DECIMAL(10, 2),
    includes JSONB DEFAULT '[]',
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EMAIL MARKETING TABLES
-- =====================================================

-- Email Campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  customer_segment VARCHAR(100) NOT NULL,
  scheduled_time TIMESTAMP,
  sent_time TIMESTAMP,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'draft',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON email_campaigns(created_at DESC);

-- Email Logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  email_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  resend_id VARCHAR(255),
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  order_id INTEGER
);

CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient_email ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- =====================================================
-- OTHER TABLES
-- =====================================================

-- Vacation Mode table
CREATE TABLE IF NOT EXISTS "vacation_mode" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"message" text DEFAULT 'We are currently on vacation and will be back soon!' NOT NULL,
	"reason" text,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Pause Services table
CREATE TABLE IF NOT EXISTS "pause_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"pause_type" text NOT NULL,
	"specific_services" text[],
	"pause_duration" integer NOT NULL,
	"pause_until_end_of_day" boolean DEFAULT false NOT NULL,
	"notification_message" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp NOT NULL,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- QR Codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'menu',
  url TEXT NOT NULL,
  qr_data TEXT NOT NULL,
  table_number INTEGER,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by_user_id INTEGER REFERENCES users(id)
);

-- Animations table
CREATE TABLE IF NOT EXISTS animations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- FOREIGN KEY CONSTRAINTS
-- =====================================================

ALTER TABLE "category_choice_groups" ADD CONSTRAINT "category_choice_groups_choice_group_id_choice_groups_id_fk" FOREIGN KEY ("choice_group_id") REFERENCES "public"."choice_groups"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "choice_items" ADD CONSTRAINT "choice_items_choice_group_id_choice_groups_id_fk" FOREIGN KEY ("choice_group_id") REFERENCES "public"."choice_groups"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "menu_item_choice_groups" ADD CONSTRAINT "menu_item_choice_groups_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "menu_item_choice_groups" ADD CONSTRAINT "menu_item_choice_groups_choice_group_id_choice_groups_id_fk" FOREIGN KEY ("choice_group_id") REFERENCES "public"."choice_groups"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tax_settings" ADD CONSTRAINT "tax_settings_default_tax_category_id_tax_categories_id_fk" FOREIGN KEY ("default_tax_category_id") REFERENCES "public"."tax_categories"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE no action ON UPDATE no action;

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert default tax category
INSERT INTO tax_categories (name, description, rate, is_active, applies_to_menu_items)
SELECT 'Standard Tax', 'Default tax category', 8.00, true, true
WHERE NOT EXISTS (SELECT 1 FROM tax_categories LIMIT 1);

-- Insert default store hours (Mon-Sun)
INSERT INTO store_hours (day_of_week, day_name, is_open, open_time, close_time) VALUES
(0, 'Sunday', true, '11:00', '21:00'),
(1, 'Monday', true, '11:00', '21:00'),
(2, 'Tuesday', true, '11:00', '21:00'),
(3, 'Wednesday', true, '11:00', '21:00'),
(4, 'Thursday', true, '11:00', '21:00'),
(5, 'Friday', true, '11:00', '22:00'),
(6, 'Saturday', true, '11:00', '22:00')
ON CONFLICT DO NOTHING;

-- Insert default delivery zones
INSERT INTO delivery_zones (zone_name, min_distance_miles, max_distance_miles, delivery_fee, estimated_time_minutes) VALUES
('Close Zone', 0.0, 5.0, 5.99, 30),
('Medium Zone', 5.0, 8.0, 8.99, 40),
('Far Zone', 8.0, 10.0, 11.99, 50)
ON CONFLICT DO NOTHING;

-- Insert default loyalty program
INSERT INTO loyalty_program (name, description, points_per_dollar, points_for_signup, is_active)
SELECT 'Loyalty Program', 'Earn points with every order!', 1.00, 100, true
WHERE NOT EXISTS (SELECT 1 FROM loyalty_program LIMIT 1);

-- Insert vacation mode default
INSERT INTO vacation_mode (is_enabled, message)
SELECT false, 'We are currently closed. Please check back soon!'
WHERE NOT EXISTS (SELECT 1 FROM vacation_mode LIMIT 1);

-- Insert default restaurant settings
INSERT INTO restaurant_settings (restaurant_name, address, phone, email, website)
SELECT 'Pizza Restaurant', '123 Main St', '(555) 123-4567', 'info@restaurant.com', 'https://restaurant.com'
WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings LIMIT 1);

-- =====================================================
-- HELPER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Success message
SELECT 'Database schema created successfully!' as message;
