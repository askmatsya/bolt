// Sample data service to populate the database with test data
import { supabase } from '../lib/supabase';

export const sampleProducts = [
  {
    name: 'Banarasi Silk Saree',
    description: 'Exquisite handwoven silk saree with gold and silver brocade work',
    cultural_significance: 'Banarasi sarees are a symbol of Indian tradition and opulence, often worn by brides and during auspicious occasions. The intricate weaving technique has been passed down through generations in Varanasi.',
    price: 15000,
    price_range: '₹12,000 - ₹25,000',
    origin: 'Varanasi, Uttar Pradesh',
    image_url: 'https://images.pexels.com/photos/8839516/pexels-photo-8839516.jpeg',
    tags: ['silk', 'handwoven', 'bridal', 'traditional'],
    occasions: ['wedding', 'festival', 'ceremony'],
    materials: ['Pure Silk', 'Gold Thread', 'Silver Thread'],
    craft_time: '45-60 days',
    is_active: true
  },
  {
    name: 'Kundan Jewelry Set',
    description: 'Traditional Kundan necklace and earring set with uncut diamonds',
    cultural_significance: 'Kundan jewelry represents the pinnacle of Indian craftsmanship, traditionally worn by Mughal royalty. Each piece tells a story of heritage and artistic excellence.',
    price: 8500,
    price_range: '₹6,000 - ₹15,000',
    origin: 'Jaipur, Rajasthan',
    image_url: 'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg',
    tags: ['kundan', 'traditional', 'royal', 'handcrafted'],
    occasions: ['wedding', 'festival', 'party'],
    materials: ['Gold', 'Kundan Stones', 'Pearls'],
    craft_time: '30 days',
    is_active: true
  },
  {
    name: 'Kashmiri Pashmina Shawl',
    description: 'Authentic Kashmiri Pashmina shawl with intricate embroidery',
    cultural_significance: 'Pashmina represents the finest textile tradition of Kashmir, made from the soft undercoat of Himalayan goats. Each shawl is a masterpiece of warmth and elegance.',
    price: 4500,
    price_range: '₹3,000 - ₹8,000',
    origin: 'Kashmir',
    image_url: 'https://images.pexels.com/photos/7148044/pexels-photo-7148044.jpeg',
    tags: ['pashmina', 'kashmir', 'luxury', 'warm'],
    occasions: ['winter', 'formal', 'gift'],
    materials: ['Pure Pashmina', 'Silk Threads'],
    craft_time: '20 days',
    is_active: true
  },
  {
    name: 'Madhubani Painting',
    description: 'Traditional Madhubani painting depicting mythological themes',
    cultural_significance: 'Madhubani art originated in Bihar and represents ancient Indian storytelling through vibrant colors and intricate patterns, traditionally painted by women on walls and floors.',
    price: 2500,
    price_range: '₹1,500 - ₹5,000',
    origin: 'Mithila, Bihar',
    image_url: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
    tags: ['art', 'traditional', 'handpainted', 'mythological'],
    occasions: ['home decor', 'gift', 'festival'],
    materials: ['Natural Pigments', 'Handmade Paper', 'Bamboo Brushes'],
    craft_time: '7 days',
    is_active: true
  },
  {
    name: 'South Indian Spice Box',
    description: 'Authentic spice collection from South India with traditional masala dabba',
    cultural_significance: 'The spice box is central to Indian cooking, representing the diversity of flavors that define regional cuisines. Each spice has been carefully selected from traditional sources.',
    price: 1200,
    price_range: '₹800 - ₹2,000',
    origin: 'Kerala & Tamil Nadu',
    image_url: 'https://images.pexels.com/photos/4198734/pexels-photo-4198734.jpeg',
    tags: ['spices', 'authentic', 'cooking', 'aromatic'],
    occasions: ['cooking', 'gift', 'festival'],
    materials: ['Fresh Spices', 'Traditional Masala Dabba'],
    craft_time: 'Fresh harvest',
    is_active: true
  },
  {
    name: 'Rajasthani Mirror Work Bag',
    description: 'Handcrafted bag with traditional Rajasthani mirror work and embroidery',
    cultural_significance: 'Mirror work embroidery is a signature craft of Rajasthan, believed to ward off evil eye while adding sparkle and beauty to textiles.',
    price: 1800,
    price_range: '₹1,200 - ₹3,000',
    origin: 'Jaisalmer, Rajasthan',
    image_url: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    tags: ['handcrafted', 'mirrors', 'embroidery', 'colorful'],
    occasions: ['casual', 'festival', 'party'],
    materials: ['Cotton', 'Glass Mirrors', 'Silk Threads'],
    craft_time: '15 days',
    is_active: true
  }
];

export const sampleCategories = [
  {
    name: 'Sarees',
    slug: 'sarees',
    description: 'Traditional Indian drapes in various fabrics and styles',
    sort_order: 1,
    is_active: true
  },
  {
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Traditional and contemporary Indian jewelry pieces',
    sort_order: 2,
    is_active: true
  },
  {
    name: 'Textiles',
    slug: 'textiles',
    description: 'Authentic handwoven fabrics and accessories',
    sort_order: 3,
    is_active: true
  },
  {
    name: 'Art & Handicrafts',
    slug: 'art-handicrafts',
    description: 'Traditional Indian art forms and handicrafts',
    sort_order: 4,
    is_active: true
  },
  {
    name: 'Spices & Food',
    slug: 'spices-food',
    description: 'Authentic Indian spices and food products',
    sort_order: 5,
    is_active: true
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Traditional bags, scarves, and other accessories',
    sort_order: 6,
    is_active: true
  }
];

export const sampleArtisans = [
  {
    name: 'Master Weaver Raghunath Das',
    bio: 'Third generation Banarasi silk weaver with over 30 years of experience',
    location: 'Varanasi, Uttar Pradesh',
    specialization: ['Banarasi Silk', 'Brocade Work', 'Traditional Weaving'],
    verification_status: 'verified',
    rating: 4.8,
    total_products: 25,
    is_active: true
  },
  {
    name: 'Kundan Master Mohan Lal',
    bio: 'Renowned Kundan jewelry craftsman from the royal city of Jaipur',
    location: 'Jaipur, Rajasthan',
    specialization: ['Kundan Jewelry', 'Polki Work', 'Traditional Setting'],
    verification_status: 'verified',
    rating: 4.9,
    total_products: 18,
    is_active: true
  },
  {
    name: 'Kashmir Craft Collective',
    bio: 'Group of skilled artisans preserving traditional Kashmiri crafts',
    location: 'Srinagar, Kashmir',
    specialization: ['Pashmina', 'Papier Mache', 'Wood Carving'],
    verification_status: 'verified',
    rating: 4.7,
    total_products: 32,
    is_active: true
  },
  {
    name: 'Artist Sunita Devi',
    bio: 'Madhubani artist continuing the family tradition of folk painting',
    location: 'Mithila, Bihar',
    specialization: ['Madhubani Painting', 'Folk Art', 'Natural Pigments'],
    verification_status: 'verified',
    rating: 4.6,
    total_products: 15,
    is_active: true
  }
];

export const sampleOrders = [
  {
    customer_name: 'Priya Sharma',
    customer_phone: '+91 98765 43210',
    customer_address: '123 MG Road, Bangalore, Karnataka 560001',
    preferred_contact: 'whatsapp',
    status: 'pending',
    order_notes: 'Please deliver before Diwali festival',
    session_id: 'demo_session_1'
  },
  {
    customer_name: 'Arjun Patel',
    customer_phone: '+91 87654 32109',
    customer_address: '456 Carter Road, Mumbai, Maharashtra 400050',
    preferred_contact: 'call',
    status: 'confirmed',
    order_notes: 'Gift wrapping required',
    session_id: 'demo_session_2'
  },
  {
    customer_name: 'Meera Krishnan',
    customer_phone: '+91 76543 21098',
    customer_address: '789 Anna Salai, Chennai, Tamil Nadu 600002',
    preferred_contact: 'whatsapp',
    status: 'shipped',
    order_notes: null,
    session_id: 'demo_session_3'
  }
];

export const populateSampleData = async () => {
  try {
    console.log('Starting to populate sample data...');

    // Insert categories first
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .upsert(sampleCategories, { onConflict: 'slug' })
      .select();

    if (categoryError) {
      console.error('Error inserting categories:', categoryError);
      return { success: false, error: categoryError };
    }

    console.log('Categories inserted:', categoryData?.length);

    // Insert artisans
    const { data: artisanData, error: artisanError } = await supabase
      .from('artisans')
      .upsert(sampleArtisans, { onConflict: 'name' })
      .select();

    if (artisanError) {
      console.error('Error inserting artisans:', artisanError);
      return { success: false, error: artisanError };
    }

    console.log('Artisans inserted:', artisanData?.length);

    // Get category IDs for products
    const categoryMap = categoryData?.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {} as Record<string, string>);

    // Get artisan IDs for products
    const artisanMap = artisanData?.reduce((acc, artisan) => {
      acc[artisan.name] = artisan.id;
      return acc;
    }, {} as Record<string, string>);

    // Insert products with proper category and artisan IDs
    const productsWithIds = sampleProducts.map((product, index) => {
      const categorySlugMap = {
        'Banarasi Silk Saree': 'sarees',
        'Kundan Jewelry Set': 'jewelry',
        'Kashmiri Pashmina Shawl': 'textiles',
        'Madhubani Painting': 'art-handicrafts',
        'South Indian Spice Box': 'spices-food',
        'Rajasthani Mirror Work Bag': 'accessories'
      };

      const artisanNameMap = {
        'Banarasi Silk Saree': 'Master Weaver Raghunath Das',
        'Kundan Jewelry Set': 'Kundan Master Mohan Lal',
        'Kashmiri Pashmina Shawl': 'Kashmir Craft Collective',
        'Madhubani Painting': 'Artist Sunita Devi',
        'South Indian Spice Box': null,
        'Rajasthani Mirror Work Bag': null
      };

      const categorySlug = categorySlugMap[product.name];
      const artisanName = artisanNameMap[product.name];

      return {
        ...product,
        category_id: categoryMap?.[categorySlug],
        artisan_id: artisanName ? artisanMap?.[artisanName] : null
      };
    });

    const { data: productData, error: productError } = await supabase
      .from('products')
      .upsert(productsWithIds, { onConflict: 'name' })
      .select();

    if (productError) {
      console.error('Error inserting products:', productError);
      return { success: false, error: productError };
    }

    console.log('Products inserted:', productData?.length);

    // Insert sample orders with product IDs
    const ordersWithProductIds = sampleOrders.map((order, index) => ({
      ...order,
      product_id: productData?.[index % productData.length]?.id || productData?.[0]?.id
    }));

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .upsert(ordersWithProductIds)
      .select();

    if (orderError) {
      console.error('Error inserting orders:', orderError);
      return { success: false, error: orderError };
    }

    console.log('Orders inserted:', orderData?.length);

    return { 
      success: true, 
      data: {
        categories: categoryData?.length || 0,
        artisans: artisanData?.length || 0,
        products: productData?.length || 0,
        orders: orderData?.length || 0
      }
    };
  } catch (error) {
    console.error('Error populating sample data:', error);
    return { success: false, error };
  }
};