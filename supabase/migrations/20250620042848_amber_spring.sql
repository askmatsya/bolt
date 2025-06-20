/*
  # Seed Initial Data for AskMatsya

  1. Categories
    - Create main product categories
    - Set up category hierarchy

  2. Artisans
    - Add sample verified artisans
    - Include contact information

  3. Products
    - Migrate existing product data
    - Add cultural significance

  4. Voice Intents
    - Common voice commands
    - Multi-language support
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Sarees', 'sarees', 'Traditional Indian sarees from various regions', 1),
('Jewelry', 'jewelry', 'Authentic Indian jewelry and ornaments', 2),
('Textiles', 'textiles', 'Traditional fabrics and textile products', 3),
('Art', 'art', 'Traditional Indian art and paintings', 4),
('Spices', 'spices', 'Authentic Indian spices and seasonings', 5),
('Accessories', 'accessories', 'Traditional bags, scarves, and accessories', 6),
('Home Decor', 'home-decor', 'Traditional home decoration items', 7);

-- Insert Sample Artisans
INSERT INTO artisans (name, bio, location, specialization, contact_info, verification_status, rating) VALUES
('Master Weaver Raghunath Das', 'Third-generation Banarasi silk weaver with 30+ years of experience', 'Varanasi, Uttar Pradesh', ARRAY['silk weaving', 'brocade work'], '{"phone": "+91-9876543210", "whatsapp": "+91-9876543210"}', 'verified', 4.8),
('Kundan Master Mohan Lal', 'Expert in traditional Kundan jewelry making, trained in Jaipur techniques', 'Jaipur, Rajasthan', ARRAY['kundan jewelry', 'traditional ornaments'], '{"phone": "+91-9876543211", "whatsapp": "+91-9876543211"}', 'verified', 4.9),
('Kashmir Craft Collective', 'Group of skilled Kashmiri artisans specializing in Pashmina and embroidery', 'Kashmir', ARRAY['pashmina', 'embroidery', 'shawls'], '{"phone": "+91-9876543212", "email": "info@kashmircraft.com"}', 'verified', 4.7),
('Artist Sunita Devi', 'Renowned Madhubani artist, winner of national craft awards', 'Mithila, Bihar', ARRAY['madhubani painting', 'traditional art'], '{"phone": "+91-9876543213", "whatsapp": "+91-9876543213"}', 'verified', 4.9),
('Desert Craft Women Collective', 'Women artisan group from Rajasthan specializing in mirror work', 'Jaisalmer, Rajasthan', ARRAY['mirror work', 'embroidery', 'bags'], '{"phone": "+91-9876543214", "whatsapp": "+91-9876543214"}', 'verified', 4.6);

-- Get category and artisan IDs for products
DO $$
DECLARE
  saree_cat_id uuid;
  jewelry_cat_id uuid;
  textile_cat_id uuid;
  art_cat_id uuid;
  spice_cat_id uuid;
  accessory_cat_id uuid;
  
  raghunath_id uuid;
  mohan_id uuid;
  kashmir_id uuid;
  sunita_id uuid;
  desert_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO saree_cat_id FROM categories WHERE slug = 'sarees';
  SELECT id INTO jewelry_cat_id FROM categories WHERE slug = 'jewelry';
  SELECT id INTO textile_cat_id FROM categories WHERE slug = 'textiles';
  SELECT id INTO art_cat_id FROM categories WHERE slug = 'art';
  SELECT id INTO spice_cat_id FROM categories WHERE slug = 'spices';
  SELECT id INTO accessory_cat_id FROM categories WHERE slug = 'accessories';
  
  -- Get artisan IDs
  SELECT id INTO raghunath_id FROM artisans WHERE name = 'Master Weaver Raghunath Das';
  SELECT id INTO mohan_id FROM artisans WHERE name = 'Kundan Master Mohan Lal';
  SELECT id INTO kashmir_id FROM artisans WHERE name = 'Kashmir Craft Collective';
  SELECT id INTO sunita_id FROM artisans WHERE name = 'Artist Sunita Devi';
  SELECT id INTO desert_id FROM artisans WHERE name = 'Desert Craft Women Collective';

  -- Insert Products
  INSERT INTO products (name, category_id, description, cultural_significance, price, price_range, origin, artisan_id, image_url, tags, occasions, materials, craft_time) VALUES
  (
    'Banarasi Silk Saree',
    saree_cat_id,
    'Exquisite handwoven silk saree with gold and silver brocade work',
    'Banarasi sarees are a symbol of Indian tradition and opulence, often worn by brides and during auspicious occasions. The intricate weaving technique has been passed down through generations in Varanasi.',
    15000,
    '₹12,000 - ₹25,000',
    'Varanasi, Uttar Pradesh',
    raghunath_id,
    'https://images.pexels.com/photos/8839516/pexels-photo-8839516.jpeg',
    ARRAY['silk', 'handwoven', 'bridal', 'traditional'],
    ARRAY['wedding', 'festival', 'ceremony'],
    ARRAY['Pure Silk', 'Gold Thread', 'Silver Thread'],
    '45-60 days'
  ),
  (
    'Kundan Jewelry Set',
    jewelry_cat_id,
    'Traditional Kundan necklace and earring set with uncut diamonds',
    'Kundan jewelry represents the pinnacle of Indian craftsmanship, traditionally worn by Mughal royalty. Each piece tells a story of heritage and artistic excellence.',
    8500,
    '₹6,000 - ₹15,000',
    'Jaipur, Rajasthan',
    mohan_id,
    'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg',
    ARRAY['kundan', 'traditional', 'royal', 'handcrafted'],
    ARRAY['wedding', 'festival', 'party'],
    ARRAY['Gold', 'Kundan Stones', 'Pearls'],
    '30 days'
  ),
  (
    'Kashmiri Pashmina Shawl',
    textile_cat_id,
    'Authentic Kashmiri Pashmina shawl with intricate embroidery',
    'Pashmina represents the finest textile tradition of Kashmir, made from the soft undercoat of Himalayan goats. Each shawl is a masterpiece of warmth and elegance.',
    4500,
    '₹3,000 - ₹8,000',
    'Kashmir',
    kashmir_id,
    'https://images.pexels.com/photos/7148044/pexels-photo-7148044.jpeg',
    ARRAY['pashmina', 'kashmir', 'luxury', 'warm'],
    ARRAY['winter', 'formal', 'gift'],
    ARRAY['Pure Pashmina', 'Silk Threads'],
    '20 days'
  ),
  (
    'Madhubani Painting',
    art_cat_id,
    'Traditional Madhubani painting depicting mythological themes',
    'Madhubani art originated in Bihar and represents ancient Indian storytelling through vibrant colors and intricate patterns, traditionally painted by women on walls and floors.',
    2500,
    '₹1,500 - ₹5,000',
    'Mithila, Bihar',
    sunita_id,
    'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
    ARRAY['art', 'traditional', 'handpainted', 'mythological'],
    ARRAY['home decor', 'gift', 'festival'],
    ARRAY['Natural Pigments', 'Handmade Paper', 'Bamboo Brushes'],
    '7 days'
  ),
  (
    'South Indian Spice Box',
    spice_cat_id,
    'Authentic spice collection from South India with traditional masala dabba',
    'The spice box is central to Indian cooking, representing the diversity of flavors that define regional cuisines. Each spice has been carefully selected from traditional sources.',
    1200,
    '₹800 - ₹2,000',
    'Kerala & Tamil Nadu',
    NULL,
    'https://images.pexels.com/photos/4198734/pexels-photo-4198734.jpeg',
    ARRAY['spices', 'authentic', 'cooking', 'aromatic'],
    ARRAY['cooking', 'gift', 'festival'],
    ARRAY['Fresh Spices', 'Traditional Masala Dabba'],
    'Fresh harvest'
  ),
  (
    'Rajasthani Mirror Work Bag',
    accessory_cat_id,
    'Handcrafted bag with traditional Rajasthani mirror work and embroidery',
    'Mirror work embroidery is a signature craft of Rajasthan, believed to ward off evil eye while adding sparkle and beauty to textiles.',
    1800,
    '₹1,200 - ₹3,000',
    'Jaisalmer, Rajasthan',
    desert_id,
    'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    ARRAY['handcrafted', 'mirrors', 'embroidery', 'colorful'],
    ARRAY['casual', 'festival', 'party'],
    ARRAY['Cotton', 'Glass Mirrors', 'Silk Threads'],
    '15 days'
  );
END $$;

-- Insert Voice Intents (English)
INSERT INTO voice_intents (intent_name, sample_phrases, expected_entities, response_template, language) VALUES
('wedding_saree', 
 ARRAY['I need a saree for my wedding', 'Show me wedding sarees', 'Bridal saree recommendations', 'Wedding saree under 20000'],
 ARRAY['budget', 'color', 'region'],
 'Here are some beautiful wedding sarees perfect for your special day. Each one carries the tradition and elegance you deserve.',
 'en'),

('budget_query',
 ARRAY['Show me products under 5000', 'What can I get for 10000 rupees', 'Budget friendly options', 'Cheap traditional items'],
 ARRAY['budget', 'category'],
 'I''ve found some excellent authentic pieces within your budget. All are directly from verified artisans.',
 'en'),

('jewelry_search',
 ARRAY['Traditional jewelry', 'Show me necklaces', 'Kundan jewelry', 'Gold ornaments'],
 ARRAY['type', 'budget', 'occasion'],
 'Our jewelry collection features authentic pieces crafted by master artisans using traditional techniques.',
 'en'),

('cultural_learning',
 ARRAY['Tell me about Madhubani art', 'What is the significance of this', 'Cultural story behind this', 'History of Banarasi sarees'],
 ARRAY['product_name', 'art_form'],
 'Let me share the beautiful cultural story behind this traditional craft and its significance in Indian heritage.',
 'en'),

('gift_suggestions',
 ARRAY['Gift ideas for my mom', 'What should I gift for Diwali', 'Traditional gifts under 3000', 'Housewarming gift ideas'],
 ARRAY['recipient', 'occasion', 'budget'],
 'Here are some thoughtful traditional gifts that carry the warmth of Indian culture and craftsmanship.',
 'en');

-- Insert Voice Intents (Tamil)
INSERT INTO voice_intents (intent_name, sample_phrases, expected_entities, response_template, language) VALUES
('wedding_saree_ta',
 ARRAY['எனக்கு திருமணத்திற்கு ஒரு புடவை வேண்டும்', 'திருமண புடவைகளை காட்டுங்கள்', 'மணப்பெண் புடவை பரிந்துரைகள்'],
 ARRAY['budget', 'color', 'region'],
 'உங்கள் சிறப்பு நாளுக்கு ஏற்ற அழகான திருமண புடவைகள் இங்கே உள்ளன. ஒவ்வொன்றும் பாரம்பரியத்தையும் நேர்த்தியையும் கொண்டுள்ளது.',
 'ta'),

('budget_query_ta',
 ARRAY['5000க்கு கீழ் பொருட்களை காட்டுங்கள்', '10000 ரூபாய்க்கு என்ன கிடைக்கும்', 'மலிவான பாரம்பரிய பொருட்கள்'],
 ARRAY['budget', 'category'],
 'உங்கள் பட்ஜெட்டுக்குள் சில சிறந்த உண்மையான பொருட்களை நான் கண்டுபிடித்துள்ளேன். அனைத்தும் சரிபார்க்கப்பட்ட கைவினைஞர்களிடமிருந்து நேரடியாக.',
 'ta'),

('jewelry_search_ta',
 ARRAY['பாரம்பரிய நகைகள்', 'நெக்லேஸ்களை காட்டுங்கள்', 'குந்தன் நகைகள்', 'தங்க அணிகலன்கள்'],
 ARRAY['type', 'budget', 'occasion'],
 'எங்கள் நகை தொகுப்பில் பாரம்பரிய நுட்பங்களைப் பயன்படுத்தி தலைசிறந்த கைவினைஞர்களால் வடிவமைக்கப்பட்ட உண்மையான பொருட்கள் உள்ளன.',
 'ta');

-- Update artisan product counts
UPDATE artisans SET total_products = (
  SELECT COUNT(*) FROM products WHERE artisan_id = artisans.id
);