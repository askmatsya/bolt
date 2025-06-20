// AI Product Assistant for generating product information
export interface ProductSuggestion {
  name: string;
  description: string;
  culturalSignificance: string;
  origin: string;
  imageUrl: string;
  tags: string[];
  occasions: string[];
  materials: string[];
  craftTime: string;
  priceRange: string;
  suggestedPrice: number;
}

// Curated high-quality product images from Pexels
const productImages = {
  sarees: [
    'https://images.pexels.com/photos/8839516/pexels-photo-8839516.jpeg',
    'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg',
    'https://images.pexels.com/photos/6625914/pexels-photo-6625914.jpeg',
    'https://images.pexels.com/photos/5128258/pexels-photo-5128258.jpeg'
  ],
  jewelry: [
    'https://images.pexels.com/photos/1454166/pexels-photo-1454166.jpeg',
    'https://images.pexels.com/photos/2735981/pexels-photo-2735981.jpeg',
    'https://images.pexels.com/photos/1454165/pexels-photo-1454165.jpeg',
    'https://images.pexels.com/photos/8839505/pexels-photo-8839505.jpeg'
  ],
  textiles: [
    'https://images.pexels.com/photos/7148044/pexels-photo-7148044.jpeg',
    'https://images.pexels.com/photos/6444/crafts-textiles-colourful-bright.jpg',
    'https://images.pexels.com/photos/7319298/pexels-photo-7319298.jpeg',
    'https://images.pexels.com/photos/5202664/pexels-photo-5202664.jpeg'
  ],
  art: [
    'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg',
    'https://images.pexels.com/photos/3004909/pexels-photo-3004909.jpeg',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg'
  ],
  spices: [
    'https://images.pexels.com/photos/4198734/pexels-photo-4198734.jpeg',
    'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg',
    'https://images.pexels.com/photos/4198627/pexels-photo-4198627.jpeg',
    'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg'
  ],
  accessories: [
    'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg',
    'https://images.pexels.com/photos/6069062/pexels-photo-6069062.jpeg',
    'https://images.pexels.com/photos/8839500/pexels-photo-8839500.jpeg',
    'https://images.pexels.com/photos/6625895/pexels-photo-6625895.jpeg'
  ]
};

// Product knowledge base for AI suggestions
const productKnowledge = {
  'banarasi silk saree': {
    description: 'Exquisite handwoven silk saree featuring intricate gold and silver brocade work, representing centuries of traditional Indian craftsmanship.',
    culturalSignificance: 'Banarasi sarees are considered the epitome of Indian textile artistry, originating from the ancient city of Varanasi. These sarees have been worn by Indian royalty and are an essential part of bridal trousseaus. The intricate weaving technique, passed down through generations, creates patterns inspired by Mughal motifs and Indian folklore.',
    origin: 'Varanasi, Uttar Pradesh, India',
    tags: ['silk', 'handwoven', 'bridal', 'traditional', 'luxury'],
    occasions: ['wedding', 'festival', 'ceremony', 'special occasion'],
    materials: ['Pure Silk', 'Gold Zari', 'Silver Thread'],
    craftTime: '45-60 days',
    priceRange: '$180 - $420',
    suggestedPrice: 250
  },
  'kundan jewelry set': {
    description: 'Traditional Kundan jewelry featuring uncut diamonds and precious stones set in gold, exemplifying the royal heritage of Indian craftsmanship.',
    culturalSignificance: 'Kundan jewelry represents the pinnacle of Indian jewelry-making art, historically worn by Mughal royalty and Indian maharajas. The technique involves setting uncut diamonds and precious stones in refined gold, creating pieces that are both opulent and spiritually significant in Indian culture.',
    origin: 'Jaipur, Rajasthan, India',
    tags: ['kundan', 'traditional', 'royal', 'handcrafted', 'precious'],
    occasions: ['wedding', 'festival', 'ceremony', 'celebration'],
    materials: ['Gold', 'Kundan Stones', 'Pearls', 'Precious Gems'],
    craftTime: '25-40 days',
    priceRange: '$120 - $300',
    suggestedPrice: 180
  },
  'kashmiri pashmina shawl': {
    description: 'Authentic Kashmiri Pashmina shawl made from the finest cashmere wool, featuring traditional hand embroidery and unmatched softness.',
    culturalSignificance: 'Pashmina represents the finest textile tradition of Kashmir, made from the soft undercoat of Himalayan Changra goats. These shawls have been treasured for over 500 years, representing the artistic heritage of Kashmir and serving as symbols of luxury and refinement across the world.',
    origin: 'Kashmir, India',
    tags: ['pashmina', 'kashmir', 'luxury', 'handwoven', 'soft'],
    occasions: ['winter', 'formal', 'travel', 'gift'],
    materials: ['Pure Pashmina', 'Cashmere', 'Silk Threads'],
    craftTime: '15-25 days',
    priceRange: '$75 - $180',
    suggestedPrice: 95
  },
  'madhubani painting': {
    description: 'Traditional folk art painting from Bihar featuring vibrant natural colors and intricate patterns depicting mythology and nature.',
    culturalSignificance: 'Madhubani art, also known as Mithila painting, is a 2500-year-old art form traditionally practiced by women in Bihar. These paintings tell stories from Hindu epics, represent local festivals, and celebrate the connection between humans and nature, using only natural pigments and traditional techniques.',
    origin: 'Mithila, Bihar, India',
    tags: ['art', 'traditional', 'handpainted', 'folk', 'mythological'],
    occasions: ['home decor', 'gift', 'cultural celebration', 'art collection'],
    materials: ['Natural Pigments', 'Handmade Paper', 'Bamboo Brushes'],
    craftTime: '5-10 days',
    priceRange: '$35 - $95',
    suggestedPrice: 50
  },
  'rajasthani mirror work bag': {
    description: 'Handcrafted bag featuring traditional Rajasthani mirror work embroidery, combining functionality with ethnic artistry.',
    culturalSignificance: 'Mirror work, known as Shisha embroidery, is a traditional craft from Rajasthan believed to ward off evil and bring good fortune. This ancient technique involves embedding small mirrors into fabric using intricate stitching patterns, creating pieces that shimmer and reflect light beautifully.',
    origin: 'Rajasthan, India',
    tags: ['handcrafted', 'mirrors', 'embroidery', 'ethnic', 'functional'],
    occasions: ['casual', 'festival', 'shopping', 'travel'],
    materials: ['Cotton Fabric', 'Glass Mirrors', 'Silk Threads', 'Beads'],
    craftTime: '10-15 days',
    priceRange: '$25 - $65',
    suggestedPrice: 35
  }
};

export class AIProductAssistant {
  // Generate AI suggestions based on product name and category
  generateSuggestions(productName: string, categorySlug: string): ProductSuggestion {
    const normalizedName = productName.toLowerCase().trim();
    
    // Check if we have specific knowledge for this product
    const exactMatch = Object.keys(productKnowledge).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    
    if (exactMatch) {
      const knowledge = productKnowledge[exactMatch];
      return {
        name: this.formatProductName(productName),
        ...knowledge,
        imageUrl: this.getRandomImage(categorySlug)
      };
    }
    
    // Generate suggestions based on category
    return this.generateCategorySuggestions(productName, categorySlug);
  }

  private generateCategorySuggestions(productName: string, categorySlug: string): ProductSuggestion {
    const categoryTemplates = {
      'sarees': {
        description: `Beautiful handwoven ${productName} showcasing traditional Indian textile artistry with intricate patterns and premium fabric quality.`,
        culturalSignificance: `This saree represents the rich textile heritage of India, where each weave tells a story of cultural traditions passed down through generations. Sarees are not just garments but symbols of grace, elegance, and Indian femininity.`,
        origin: 'Various regions of India',
        tags: ['saree', 'traditional', 'handwoven', 'elegant', 'cultural'],
        occasions: ['wedding', 'festival', 'ceremony', 'celebration'],
        materials: ['Silk', 'Cotton', 'Zari Work'],
        craftTime: '30-45 days',
        priceRange: '$120 - $280',
        suggestedPrice: 180
      },
      'jewelry': {
        description: `Exquisite ${productName} crafted using traditional Indian jewelry-making techniques, featuring intricate designs and premium materials.`,
        culturalSignificance: `Traditional Indian jewelry holds deep cultural and spiritual significance, often passed down through generations. Each piece represents prosperity, protection, and the rich heritage of Indian craftsmanship.`,
        origin: 'Rajasthan/Gujarat, India',
        tags: ['jewelry', 'traditional', 'handcrafted', 'precious', 'ornate'],
        occasions: ['wedding', 'festival', 'celebration', 'religious ceremony'],
        materials: ['Gold', 'Silver', 'Precious Stones', 'Pearls'],
        craftTime: '20-35 days',
        priceRange: '$85 - $250',
        suggestedPrice: 140
      },
      'textiles': {
        description: `Premium quality ${productName} representing the finest Indian textile traditions, featuring authentic patterns and superior craftsmanship.`,
        culturalSignificance: `Indian textiles are renowned worldwide for their quality, diversity, and artistic value. Each piece reflects the regional traditions and cultural heritage of its origin, representing centuries of textile innovation.`,
        origin: 'Various textile regions of India',
        tags: ['textiles', 'handwoven', 'authentic', 'traditional', 'quality'],
        occasions: ['daily use', 'formal', 'gift', 'home decor'],
        materials: ['Cotton', 'Silk', 'Natural Fibers'],
        craftTime: '15-30 days',
        priceRange: '$45 - $120',
        suggestedPrice: 75
      },
      'art-handicrafts': {
        description: `Authentic ${productName} showcasing traditional Indian folk art techniques and cultural storytelling through visual artistry.`,
        culturalSignificance: `Indian folk art represents the cultural soul of the country, with each region having its unique style and storytelling tradition. These artworks preserve ancient techniques and narratives that connect us to our cultural roots.`,
        origin: 'Various art regions of India',
        tags: ['art', 'folk', 'traditional', 'handmade', 'cultural'],
        occasions: ['home decor', 'gift', 'cultural appreciation', 'collection'],
        materials: ['Natural Pigments', 'Handmade Paper', 'Traditional Tools'],
        craftTime: '7-15 days',
        priceRange: '$25 - $85',
        suggestedPrice: 45
      },
      'spices-food': {
        description: `Premium ${productName} sourced from traditional Indian regions, offering authentic flavors and aromatic experiences.`,
        culturalSignificance: `Indian spices are the foundation of the country's culinary heritage, each carrying medicinal properties and cultural significance. They represent the diversity of Indian cuisine and the ancient knowledge of flavor balancing.`,
        origin: 'Kerala/Tamil Nadu, India',
        tags: ['spices', 'authentic', 'aromatic', 'culinary', 'traditional'],
        occasions: ['cooking', 'gifting', 'festivals', 'daily use'],
        materials: ['Fresh Spices', 'Traditional Processing', 'Natural Preservation'],
        craftTime: 'Fresh processing',
        priceRange: '$15 - $45',
        suggestedPrice: 25
      },
      'accessories': {
        description: `Stylish ${productName} combining traditional Indian craftsmanship with modern functionality, perfect for contemporary ethnic fashion.`,
        culturalSignificance: `Indian accessories blend traditional artistry with practical use, often featuring regional embroidery techniques, mirror work, and beadwork that represent the local cultural identity and artistic traditions.`,
        origin: 'Rajasthan/Gujarat, India',
        tags: ['accessories', 'ethnic', 'functional', 'stylish', 'handcrafted'],
        occasions: ['casual', 'festival', 'shopping', 'ethnic wear'],
        materials: ['Cotton', 'Silk', 'Mirrors', 'Beads', 'Embroidery'],
        craftTime: '10-20 days',
        priceRange: '$20 - $55',
        suggestedPrice: 32
      }
    };

    const template = categoryTemplates[categorySlug] || categoryTemplates['accessories'];
    
    return {
      name: this.formatProductName(productName),
      imageUrl: this.getRandomImage(categorySlug),
      ...template
    };
  }

  private formatProductName(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private getRandomImage(categorySlug: string): string {
    const categoryKey = this.mapCategoryToImageKey(categorySlug);
    const images = productImages[categoryKey] || productImages.accessories;
    return images[Math.floor(Math.random() * images.length)];
  }

  private mapCategoryToImageKey(categorySlug: string): string {
    const mapping = {
      'sarees': 'sarees',
      'jewelry': 'jewelry', 
      'textiles': 'textiles',
      'art-handicrafts': 'art',
      'spices-food': 'spices',
      'accessories': 'accessories'
    };
    
    return mapping[categorySlug] || 'accessories';
  }

  // Convert INR to USD (approximate conversion)
  convertINRToUSD(inrAmount: number): number {
    const conversionRate = 0.012; // 1 INR ≈ 0.012 USD (approximate)
    return Math.round(inrAmount * conversionRate);
  }

  // Generate smart price suggestions based on category and product type
  generatePriceSuggestion(productName: string, categorySlug: string): number {
    const suggestion = this.generateSuggestions(productName, categorySlug);
    return suggestion.suggestedPrice;
  }
}