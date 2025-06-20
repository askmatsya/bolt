/*
  # Add policies for sample data insertion

  1. Temporary Policies for Demo
    - Allow anonymous users to insert sample data
    - These should be removed in production

  2. Tables affected
    - categories
    - artisans  
    - products
    - orders

  Note: These are demo policies only. In production, use proper authentication.
*/

-- Allow anonymous users to insert categories (for demo only)
CREATE POLICY "Allow demo data insertion for categories"
  ON categories
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert artisans (for demo only)  
CREATE POLICY "Allow demo data insertion for artisans"
  ON artisans
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert products (for demo only)
CREATE POLICY "Allow demo data insertion for products"
  ON products
  FOR INSERT  
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to insert orders (for demo only)
CREATE POLICY "Allow demo data insertion for orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update products (for admin demo)
CREATE POLICY "Allow demo data updates for products"
  ON products
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to update orders (for admin demo)  
CREATE POLICY "Allow demo data updates for orders"
  ON orders
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);