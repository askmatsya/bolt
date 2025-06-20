-- Allow anonymous users to update artisans (for admin demo)
CREATE POLICY "Allow demo data updates for artisans"
  ON artisans
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);