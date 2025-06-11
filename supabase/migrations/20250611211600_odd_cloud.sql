/*
  # Stripe Integration with Points System

  1. New Tables
    - `subscriptions` - Tracks user subscription data from Stripe
    - `transactions` - Records all user purchases and payments
    - `user_points` - Stores user point balances
    - `points_transactions` - Records point earning and redemption history
    - `products` - Syncs product data from Stripe

  2. Security
    - Enable RLS on all tables
    - Add policies to ensure users can only view their own data
    - Products table is publicly viewable (for active products)

  3. Functions
    - `deduct_points` - Securely deducts points from a user's balance
    - `award_points` - Adds points to a user's balance
*/

-- User subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User purchases/transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  description TEXT,
  product_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points system table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points transactions/history
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired'
  description TEXT,
  transaction_id UUID REFERENCES transactions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products synced from Stripe
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_product_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in cents
  type TEXT DEFAULT 'one_time', -- 'one_time' or 'subscription'
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own points" ON user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own points history" ON points_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (active = true);

-- Function to deduct points
CREATE OR REPLACE FUNCTION deduct_points(
  user_id UUID,
  points_to_deduct INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_points
  SET available_points = available_points - points_to_deduct,
      updated_at = NOW()
  WHERE user_points.user_id = deduct_points.user_id
    AND available_points >= points_to_deduct;
  
  IF FOUND THEN
    INSERT INTO points_transactions (user_id, points, type, description)
    VALUES (user_id, -points_to_deduct, 'redeemed', 'Points redeemed for discount');
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award points
CREATE OR REPLACE FUNCTION award_points(
  user_id UUID,
  points_to_award INTEGER,
  description TEXT DEFAULT 'Points earned from purchase',
  transaction_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  existing_record BOOLEAN;
BEGIN
  -- Check if user already has a points record
  SELECT EXISTS(
    SELECT 1 FROM user_points WHERE user_points.user_id = award_points.user_id
  ) INTO existing_record;
  
  IF existing_record THEN
    -- Update existing points
    UPDATE user_points
    SET total_points = total_points + points_to_award,
        available_points = available_points + points_to_award,
        lifetime_points = lifetime_points + points_to_award,
        updated_at = NOW()
    WHERE user_points.user_id = award_points.user_id;
  ELSE
    -- Create new points record
    INSERT INTO user_points (
      user_id, 
      total_points, 
      available_points, 
      lifetime_points
    )
    VALUES (
      user_id, 
      points_to_award, 
      points_to_award, 
      points_to_award
    );
  END IF;
  
  -- Record points transaction
  INSERT INTO points_transactions (
    user_id, 
    points, 
    type, 
    description,
    transaction_id
  )
  VALUES (
    user_id, 
    points_to_award, 
    'earned', 
    description,
    transaction_id
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
FROM 
  stripe_customers sc
JOIN 
  stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE 
  sc.deleted_at IS NULL AND ss.deleted_at IS NULL;

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
FROM 
  stripe_customers sc
JOIN 
  stripe_orders so ON sc.customer_id = so.customer_id
WHERE 
  sc.deleted_at IS NULL AND so.deleted_at IS NULL;