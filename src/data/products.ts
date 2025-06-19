import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Banarasi Silk Saree',
    category: 'Sarees',
    description: 'Exquisite handwoven silk saree with gold and silver brocade work',
    culturalSignificance: 'Banarasi sarees are a symbol of Indian tradition and opulence, often worn by brides and during auspicious occasions. The intricate weaving technique has been passed down through generations in Varanasi.',
    price: 15000,
    priceRange: '₹12,000 - ₹25,000',
    origin: 'Varanasi, Uttar Pradesh',
    artisan: 'Master Weaver Raghunath Das',
    image: 'https://images.pexels.com/photos/8839516/pexels-photo-8839516.jpeg',
    tags: ['silk', 'handwoven', 'bridal', 'traditional'],
    occasions: ['wedding', 'festival', 'ceremony'],
    materials: ['Pure Silk', 'Gold Thread', 'Silver Thread'],
    craftTime: '45-60 days'
  },
  {
    id: '2',
    name: 'Kundan Jewelry Set',
    category: 'Jewelry',
    description: 'Traditional Kundan necklace and earring set with uncut diamonds',
    culturalSignificance: 'Kundan jewelry represents the pinnacle of Indian craftsmanship, traditionally worn by Mughal royalty. Each piece tells a story of heritage and artistic excellence.',
    price: 8500,
    priceRange: '₹6,000 - ₹15,000',
    origin: 'Jaipur, Rajasthan',
    artisan: 'Kundan Master Mohan Lal',
    image: 'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg',
    tags: ['kundan', 'traditional', 'royal', 'handcrafted'],
    occasions: ['wedding', 'festival', 'party'],
    materials: ['Gold', 'Kundan Stones', 'Pearls'],
    craftTime: '30 days'
  },
  {
    id: '3',
    name: 'Kashmiri Pashmina Shawl',
    category: 'Textiles',
    description: 'Authentic Kashmiri Pashmina shawl with intricate embroidery',
    culturalSignificance: 'Pashmina represents the finest textile tradition of Kashmir, made from the soft undercoat of Himalayan goats. Each shawl is a masterpiece of warmth and elegance.',
    price: 4500,
    priceRange: '₹3,000 - ₹8,000',
    origin: 'Kashmir',
    artisan: 'Kashmir Craft Collective',
    image: 'https://images.pexels.com/photos/7148044/pexels-photo-7148044.jpeg',
    tags: ['pashmina', 'kashmir', 'luxury', 'warm'],
    occasions: ['winter', 'formal', 'gift'],
    materials: ['Pure Pashmina', 'Silk Threads'],
    craftTime: '20 days'
  },
  {
    id: '4',
    name: 'Madhubani Painting',
    category: 'Art',
    description: 'Traditional Madhubani painting depicting mythological themes',
    culturalSignificance: 'Madhubani art originated in Bihar and represents ancient Indian storytelling through vibrant colors and intricate patterns, traditionally painted by women on walls and floors.',
    price: 2500,
    priceRange: '₹1,500 - ₹5,000',
    origin: 'Mithila, Bihar',
    artisan: 'Artist Sunita Devi',
    image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
    tags: ['art', 'traditional', 'handpainted', 'mythological'],
    occasions: ['home decor', 'gift', 'festival'],
    materials: ['Natural Pigments', 'Handmade Paper', 'Bamboo Brushes'],
    craftTime: '7 days'
  },
  {
    id: '5',
    name: 'South Indian Spice Box',
    category: 'Spices',
    description: 'Authentic spice collection from South India with traditional masala dabba',
    culturalSignificance: 'The spice box is central to Indian cooking, representing the diversity of flavors that define regional cuisines. Each spice has been carefully selected from traditional sources.',
    price: 1200,
    priceRange: '₹800 - ₹2,000',
    origin: 'Kerala & Tamil Nadu',
    image: 'https://images.pexels.com/photos/4198734/pexels-photo-4198734.jpeg',
    tags: ['spices', 'authentic', 'cooking', 'aromatic'],
    occasions: ['cooking', 'gift', 'festival'],
    materials: ['Fresh Spices', 'Traditional Masala Dabba'],
    craftTime: 'Fresh harvest'
  },
  {
    id: '6',
    name: 'Rajasthani Mirror Work Bag',
    category: 'Accessories',
    description: 'Handcrafted bag with traditional Rajasthani mirror work and embroidery',
    culturalSignificance: 'Mirror work embroidery is a signature craft of Rajasthan, believed to ward off evil eye while adding sparkle and beauty to textiles.',
    price: 1800,
    priceRange: '₹1,200 - ₹3,000',
    origin: 'Jaisalmer, Rajasthan',
    artisan: 'Desert Craft Women Collective',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    tags: ['handcrafted', 'mirrors', 'embroidery', 'colorful'],
    occasions: ['casual', 'festival', 'party'],
    materials: ['Cotton', 'Glass Mirrors', 'Silk Threads'],
    craftTime: '15 days'
  }
];

export const categories = [
  'All',
  'Sarees',
  'Jewelry', 
  'Textiles',
  'Art',
  'Spices',
  'Accessories',
  'Home Decor'
];

export const occasions = [
  'Wedding',
  'Festival',
  'Casual',
  'Formal',
  'Gift',
  'Home Decor'
];

export const priceRanges = [
  { label: 'Under ₹1,000', value: [0, 1000] },
  { label: '₹1,000 - ₹5,000', value: [1000, 5000] },
  { label: '₹5,000 - ₹10,000', value: [5000, 10000] },
  { label: '₹10,000 - ₹20,000', value: [10000, 20000] },
  { label: 'Above ₹20,000', value: [20000, 100000] }
];