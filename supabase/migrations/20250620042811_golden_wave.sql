/*
  # AskMatsya Database Schema

  1. New Tables
    - `categories` - Product categories with hierarchy support
    - `artisans` - Artisan/seller information and verification
    - `products` - Complete product catalog with cultural context
    - `user_interactions` - Analytics and user behavior tracking
    - `voice_intents` - AI training data for voice recognition
    - `orders` - Order management and tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access on products/categories
    - Add policies for authenticated users on orders
    - Add policies for analytics data collection

  3. Features
    - Full-text search on products
    - Hierarchical categories
    - Voice interaction tracking
    - Cultural significance storage
    - Multi-language support
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Categories table with hierarchy support
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Artisans table
CREATE TABLE IF NOT EXISTS artisans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text,
  location text NOT NULL,
  specialization text[] DEFAULT '{}',
  contact_info jsonb,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  rating numeric(3,2) CHECK (rating >= 0 AND rating <= 5),
  total_products integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  description text NOT NULL,
  cultural_significance text NOT NULL,
  price numeric(10,2) NOT NULL CHECK (price > 0),
  price_range text NOT NULL,
  origin text NOT NULL,
  artisan_id uuid REFERENCES artisans(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  tags text[] DEFAULT '{}',
  occasions text[] DEFAULT '{}',
  materials text[] DEFAULT '{}',
  craft_time text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User interactions for analytics
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  interaction_type text NOT NULL CHECK (interaction_type IN ('voice_query', 'product_view', 'product_like', 'order_intent', 'cultural_interest')),
  query_text text,
  voice_transcript text,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  response_data jsonb,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ta')),
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Voice intents for AI training
CREATE TABLE IF NOT EXISTS voice_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_name text NOT NULL,
  sample_phrases text[] NOT NULL,
  expected_entities text[] DEFAULT '{}',
  response_template text NOT NULL,
  language text DEFAULT 'en' CHECK (language IN ('en', 'ta')),
  confidence_threshold numeric(3,2) DEFAULT 0.7 CHECK (confidence_threshold >= 0 AND confidence_threshold <= 1),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  preferred_contact text DEFAULT 'whatsapp' CHECK (preferred_contact IN ('whatsapp', 'call')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  order_notes text,
  total_amount numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_artisan ON products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_occasions ON products USING GIN(occasions);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || description));

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

CREATE INDEX IF NOT EXISTS idx_user_interactions_session ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_product ON user_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_created ON user_interactions(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: Public read access
CREATE POLICY "Categories are publicly readable"
  ON categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- Artisans: Public read access for verified artisans
CREATE POLICY "Verified artisans are publicly readable"
  ON artisans
  FOR SELECT
  TO public
  USING (is_active = true AND verification_status = 'verified');

-- Products: Public read access for active products
CREATE POLICY "Active products are publicly readable"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

-- User interactions: Allow anonymous analytics collection
CREATE POLICY "Allow anonymous interaction tracking"
  ON user_interactions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- User interactions: Users can read their own data
CREATE POLICY "Users can read own interactions"
  ON user_interactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Voice intents: Public read for active intents
CREATE POLICY "Active voice intents are publicly readable"
  ON voice_intents
  FOR SELECT
  TO public
  USING (is_active = true);

-- Orders: Users can create orders
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Orders: Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voice_intents_updated_at BEFORE UPDATE ON voice_intents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();