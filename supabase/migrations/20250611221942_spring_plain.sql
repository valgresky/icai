/*
  # Stripe Integration Schema

  1. New Tables
    - `stripe_customers`
      - `id` (bigint, primary key)
      - `user_id` (uuid, references auth.users)
      - `customer_id` (text, unique)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp)
    
    - `stripe_subscriptions`
      - `id` (bigint, primary key)
      - `customer_id` (text, not null)
      - `subscription_id` (text, unique)
      - `price_id` (text)
      - `current_period_start` (bigint)
      - `current_period_end` (bigint)
      - `cancel_at_period_end` (boolean)
      - `payment_method_brand` (text)
      - `payment_method_last4` (text)
      - `status` (stripe_subscription_status enum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp)
    
    - `stripe_orders`
      - `id` (bigint, primary key)
      - `checkout_session_id` (text, not null)
      - `payment_intent_id` (text, not null)
      - `customer_id` (text, not null)
      - `amount_subtotal` (bigint, not null)
      - `amount_total` (bigint, not null)
      - `currency` (text, not null)
      - `payment_status` (text, not null)
      - `status` (stripe_order_status enum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `deleted_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to view their own data
    - Create views for easier querying
*/

-- Create enums only if they don't exist
DO $$ BEGIN
    CREATE TYPE stripe_subscription_status AS ENUM (
      'not_started',
      'incomplete',
      'incomplete_expired', 
      'trialing',
      'active',
      'past_due',
      'canceled',
      'unpaid',
      'paused'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE stripe_order_status AS ENUM (
      'pending',
      'completed',
      'canceled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Stripe customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  customer_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Stripe subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id BIGINT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  subscription_id TEXT UNIQUE,
  price_id TEXT,
  current_period_start BIGINT,
  current_period_end BIGINT,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_method_brand TEXT,
  payment_method_last4 TEXT,
  status stripe_subscription_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Stripe orders table (for one-time purchases)
CREATE TABLE IF NOT EXISTS stripe_orders (
  id BIGINT PRIMARY KEY,
  checkout_session_id TEXT NOT NULL,
  payment_intent_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  amount_subtotal BIGINT NOT NULL,
  amount_total BIGINT NOT NULL,
  currency TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  status stripe_order_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE UNIQUE INDEX IF NOT EXISTS stripe_customers_user_id_key ON stripe_customers(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS stripe_customers_customer_id_key ON stripe_customers(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS stripe_subscriptions_customer_id_key ON stripe_subscriptions(customer_id);

-- Enable RLS
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;

-- RLS Policies
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers 
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

-- Drop existing views if they exist
DROP VIEW IF EXISTS stripe_user_subscriptions;
DROP VIEW IF EXISTS stripe_user_orders;

-- Create views for easier querying
CREATE OR REPLACE VIEW stripe_user_subscriptions AS
SELECT 
  sc.customer_id,
  ss.subscription_id,
  ss.status as subscription_status,
  ss.price_id,
  ss.current_period_start,
  ss.current_period_end,
  ss.cancel_at_period_end,
  ss.payment_method_brand,
  ss.payment_method_last4
FROM stripe_customers sc
JOIN stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE sc.deleted_at IS NULL AND ss.deleted_at IS NULL;

CREATE OR REPLACE VIEW stripe_user_orders AS
SELECT 
  sc.customer_id,
  so.id as order_id,
  so.checkout_session_id,
  so.payment_intent_id,
  so.amount_subtotal,
  so.amount_total,
  so.currency,
  so.payment_status,
  so.status as order_status,
  so.created_at as order_date
FROM stripe_customers sc
JOIN stripe_orders so ON sc.customer_id = so.customer_id
WHERE sc.deleted_at IS NULL AND so.deleted_at IS NULL;