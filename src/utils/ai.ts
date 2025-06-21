import { Product, Recommendation } from '../types';
import { productService } from '../services/admin';

export class AIMatsya {
  private language: 'en' | 'ta' = 'en';
  private products: Product[] = []; // Will be populated from database
  private lastFetch: number = 0;
  private fetchCooldown: number = 5000; // Reduced to 5 seconds for better responsiveness

  setLanguage(lang: 'en' | 'ta') {
    this.language = lang;
  }

  // Force refresh products (bypasses cache)
  async refreshProducts(): Promise<void> {
    console.log('🔄 Forcing refresh of voice search product cache...');
    this.lastFetch = 0; // Reset cache timestamp
    await this.loadProducts();
    console.log(`✅ Voice search cache refreshed with ${this.products.length} products`);
  }
  // Fetch products from database with caching
  private async loadProducts(): Promise<Product[]> {
    const now = Date.now();
    
    // Use cache if recent fetch (within cooldown period)
    if (this.products.length > 0 && (now - this.lastFetch) < this.fetchCooldown) {
      console.log(`Using cached products (${this.products.length} items)`);
      return this.products;
    }

    console.log('🔍 Fetching fresh products from database...');

    try {
      // Fetch from database using the service
      const dbProducts = await productService.getAll();
      
      // Convert database products to our Product interface format
      this.products = dbProducts.map(dbProduct => ({
        id: dbProduct.id,
        name: dbProduct.name,
        category: dbProduct.categories?.name || 'Uncategorized',
        description: dbProduct.description,
        culturalSignificance: dbProduct.cultural_significance,
        price: dbProduct.price,
        priceRange: dbProduct.price_range,
        origin: dbProduct.origin,
        artisan: dbProduct.artisans?.name,
        image: dbProduct.image_url,
        tags: dbProduct.tags || [],
        occasions: dbProduct.occasions || [],
        materials: dbProduct.materials || [],
        craftTime: dbProduct.craft_time
      }));

      this.lastFetch = now;
      console.log(`✅ Loaded ${this.products.length} products from database for voice search`);
      
      return this.products;
    } catch (error) {
      console.warn('Database not available, using fallback data:', error.message);
      
      // Fallback to static products if database fails
      try {
        const { sampleProducts } = await import('../data/products');
        this.products = this.convertDbProductsToProducts(sampleProducts);
        this.lastFetch = now;
        console.log(`⚠️ Using sample data fallback (${this.products.length} items)`);
      } catch (fallbackError) {
        console.error('Failed to load fallback products:', fallbackError);
        // Use minimal fallback data if everything fails
        this.products = this.getMinimalFallbackProducts();
      }
      
      return this.products;
    }
  }

  // Convert database products to our Product interface format
  private convertDbProductsToProducts(dbProducts: any[]): Product[] {
    return dbProducts.map(dbProduct => ({
      id: dbProduct.id,
      name: dbProduct.name,
      category: dbProduct.category || 'Uncategorized',
      description: dbProduct.description,
      culturalSignificance: dbProduct.cultural_significance || dbProduct.culturalSignificance || '',
      price: dbProduct.price,
      priceRange: dbProduct.price_range || dbProduct.priceRange || `$${dbProduct.price}`,
      origin: dbProduct.origin,
      artisan: dbProduct.artisan || undefined,
      image: dbProduct.image_url || dbProduct.image || '',
      tags: dbProduct.tags || [],
      occasions: dbProduct.occasions || [],
      materials: dbProduct.materials || [],
      craftTime: dbProduct.craft_time || dbProduct.craftTime
    }));
  }

  // Minimal fallback when everything fails
  private getMinimalFallbackProducts(): Product[] {
    return [
      {
        id: 'demo-1',
        name: 'Traditional Handcraft Item',
        category: 'Demo',
        description: 'Sample product for demonstration purposes.',
        culturalSignificance: 'Represents traditional Indian craftsmanship.',
        price: 100,
        priceRange: '$50 - $150',
        origin: 'India',
        image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
        tags: ['traditional', 'handmade'],
        occasions: ['gift', 'home decor'],
        materials: ['natural materials'],
        craftTime: '1 week'
      }
    ];
  }

  private getResponse(key: string, params?: any): string {
    const responses = {
      en: {
        wedding: `Namaste! For weddings, I recommend these exquisite pieces that will make the occasion truly special. Banarasi sarees are perfect for brides, while Kundan jewelry adds royal elegance. Each piece carries centuries of tradition and craftsmanship.`,
        budget: `I've found some excellent options within your $${params?.budget} budget. All these products are authentic and come directly from artisans.`,
        saree: `Saree - the pride of Indian women! Our collection features authentic handwoven sarees from different regions. Each saree tells a story of tradition, artistry, and cultural heritage.`,
        jewelry: `Traditional Indian jewelry is not just adornment - it's a symbol of prosperity and cultural identity. Our Kundan and traditional pieces are crafted by master artisans using time-honored techniques.`,
        cultural: `Let me tell you about ${params?.productName}! ${params?.significance}\n\nThis beautiful tradition has been passed down through generations, and each piece we offer maintains these authentic practices.`,
        gift: `Gift-giving is a beautiful way to show love! These handcrafted pieces make perfect gifts - each one unique and meaningful. They carry the warmth of Indian tradition and the skill of our artisans.`,
        spice: `Indian spices - a treasure trove of flavors and aromas! Our spice collection brings authentic flavors from different regions of India. Each spice is carefully sourced and traditionally processed.`,
        newProducts: `Great news! I can see we have ${params?.count} products in our collection, including some recently added items. Let me show you what's available!`,
        noProducts: `I apologize, but I couldn't find any products matching your request at the moment. Our catalog is constantly being updated with new authentic items.`,
        default: `Namaste! I'm here to help you discover authentic Indian ethnic products. Here are some of our featured items that showcase the beauty of Indian craftsmanship. What specific type of product are you looking for?`
      },
      ta: {
        wedding: `வணக்கம்! திருமணங்களுக்கு, இந்த அழகான பொருட்களை நான் பரிந்துரைக்கிறேன், அவை இந்த நிகழ்வை உண்மையிலேயே சிறப்பாக்கும். பனாரசி புடவைகள் மணப்பெண்களுக்கு சரியானவை, அதே நேரத்தில் குந்தன் நகைகள் அரச நேர்த்தியை சேர்க்கின்றன. ஒவ்வொரு பொருளும் நூற்றாண்டுகளின் பாரம்பரியத்தையும் கைவினைத்திறனையும் கொண்டுள்ளது.`,
        budget: `உங்கள் $${params?.budget} பட்ஜெட்டுக்குள் சில சிறந்த விருப்பங்களை நான் கண்டுபிடித்துள்ளேன். இந்த அனைத்து பொருட்களும் உண்மையானவை மற்றும் நேரடியாக கைவினைஞர்களிடமிருந்து வருகின்றன.`,
        saree: `புடவை - இந்திய பெண்களின் பெருமை! எங்கள் தொகுப்பில் பல்வேறு பகுதிகளிலிருந்து உண்மையான கைத்தறி புடவைகள் உள்ளன. ஒவ்வொரு புடவையும் பாரம்பரியம், கலை மற்றும் கலாச்சார பாரம்பரியத்தின் கதையைச் சொல்கிறது.`,
        jewelry: `பாரம்பரிய இந்திய நகைகள் வெறும் அலங்காரம் அல்ல - அது செழிப்பு மற்றும் கலாச்சார அடையாளத்தின் சின்னம். எங்கள் குந்தன் மற்றும் பாரம்பரிய பொருட்கள் காலங்காலமாக கடைபிடிக்கப்படும் நுட்பங்களைப் பயன்படுத்தி தலைசிறந்த கைவினைஞர்களால் வடிவமைக்கப்பட்டுள்ளன.`,
        cultural: `${params?.productName} பற்றி நான் உங்களுக்குச் சொல்கிறேன்! ${params?.significance}\n\nஇந்த அழகான பாரம்பரியம் தலைமுறைகளாக கடத்தப்பட்டு வருகிறது, மற்றும் நாங்கள் வழங்கும் ஒவ்வொரு பொருளும் இந்த உண்மையான நடைமுறைகளை பராமரிக்கிறது.`,
        gift: `பரிசு வழங்குவது அன்பைக் காட்டும் அழகான வழி! இந்த கைவினைப் பொருட்கள் சரியான பரிசுகளாக அமைகின்றன - ஒவ்வொன்றும் தனித்துவமானது மற்றும் அர்த்தமுள்ளது. அவை இந்திய பாரம்பரியத்தின் அரவணைப்பையும் எங்கள் கைவினைஞர்களின் திறமையையும் கொண்டுள்ளன.`,
        spice: `இந்திய மசாலாக்கள் - சுவைகள் மற்றும் நறுமணங்களின் பொக்கிஷம்! எங்கள் மசாலா தொகுப்பு இந்தியாவின் பல்வேறு பகுதிகளிலிருந்து உண்மையான சுவைகளைக் கொண்டு வருகிறது. ஒவ்வொரு மசாலாவும் கவனமாக தேர்ந்தெடுக்கப்பட்டு பாரம்பரியமாக செயலாக்கப்படுகிறது.`,
        newProducts: `நல்ல செய்தி! எங்கள் தொகுப்பில் ${params?.count} பொருட்கள் உள்ளன என்பதை நான் பார்க்க முடிகிறது, அதில் சமீபத்தில் சேர்க்கப்பட்ட சில பொருட்களும் அடங்கும். கிடைக்கும் பொருட்களை உங்களுக்குக் காட்டுகிறேன்!`,
        noProducts: `மன்னிக்கவும், உங்கள் கோரிக்கைக்கு பொருந்தும் எந்த பொருட்களையும் இந்த நேரத்தில் என்னால் கண்டுபிடிக்க முடியவில்லை. எங்கள் பட்டியல் தொடர்ந்து புதிய உண்மையான பொருட்களுடன் புதுப்பிக்கப்படுகிறது.`,
        default: `வணக்கம்! உண்மையான இந்திய பாரம்பரிய பொருட்களைக் கண்டறிய நான் இங்கே உதவ இருக்கிறேன். இந்திய கைவினைத்திறனின் அழகைக் காட்டும் எங்கள் சிறப்பு பொருட்களில் சில இங்கே உள்ளன. நீங்கள் எந்த குறிப்பிட்ட வகை பொருளைத் தேடுகிறீர்கள்?`
      }
    };

    return responses[this.language][key] || responses.en[key];
  }

  async processVoiceInput(input: string): Promise<{ response: string; products: Product[]; type: 'text' | 'products' | 'cultural' | 'order' }> {
    const lowerInput = input.toLowerCase();
    
    // Load fresh products from database
    const availableProducts = await this.loadProducts();
    
    // Detect language from input
    if (input.includes('திருமண') || input.includes('புடவை') || input.includes('நகை') || input.includes('மசாலா')) {
      this.language = 'ta';
    }
    
    // Wedding/Bridal queries (English and Tamil)
    if (lowerInput.includes('wedding') || lowerInput.includes('bridal') || lowerInput.includes('marriage') || 
        lowerInput.includes('திருமண') || lowerInput.includes('கல்யாண')) {
      const weddingProducts = availableProducts.filter(p => 
        p.occasions.includes('wedding') || p.tags.includes('bridal')
      );
      
      return {
        response: this.getResponse('wedding'),
        products: weddingProducts,
        type: 'products'
      };
    }

    // Budget-based queries
    const budgetMatch = lowerInput.match(/under (\d+)|below (\d+)|less than (\d+)|(\d+) rupees|₹(\d+)|(\d+) ரூபாய்|\$(\d+)|(\d+) dollars?/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4] || budgetMatch[5] || budgetMatch[6] || budgetMatch[7] || budgetMatch[8]);
      const budgetProducts = availableProducts.filter(p => p.price <= budget);
      
      return {
        response: this.getResponse('budget', { budget }),
        products: budgetProducts.slice(0, 6), // Show more results
        type: 'products'
      };
    }

    // Category-specific queries (English and Tamil)
    if (lowerInput.includes('saree') || lowerInput.includes('புடவை')) {
      const sarees = availableProducts.filter(p => 
        p.category.toLowerCase().includes('saree') || 
        p.name.toLowerCase().includes('saree') ||
        p.tags.some(tag => tag.toLowerCase().includes('saree'))
      );
      return {
        response: this.getResponse('saree'),
        products: sarees,
        type: 'products'
      };
    }

    if (lowerInput.includes('jewelry') || lowerInput.includes('jewellery') || lowerInput.includes('நகை')) {
      const jewelry = availableProducts.filter(p => 
        p.category.toLowerCase().includes('jewelry') ||
        p.name.toLowerCase().includes('jewelry') ||
        p.tags.some(tag => tag.toLowerCase().includes('jewelry'))
      );
      return {
        response: this.getResponse('jewelry'),
        products: jewelry,
        type: 'products'
      };
    }

    // Cultural learning queries (English and Tamil)
    if (lowerInput.includes('learn') || lowerInput.includes('about') || lowerInput.includes('culture') || 
        lowerInput.includes('story') || lowerInput.includes('history') || lowerInput.includes('கலாச்சார') || 
        lowerInput.includes('கதை') || lowerInput.includes('வரலாறு')) {
      const culturalProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
      
      if (culturalProduct) {
        return {
          response: this.getResponse('cultural', { 
            productName: culturalProduct.name, 
            significance: culturalProduct.culturalSignificance 
          }),
          products: [culturalProduct],
          type: 'cultural'
        };
      }
    }

    // Gift queries (English and Tamil)
    if (lowerInput.includes('gift') || lowerInput.includes('present') || lowerInput.includes('பரிசு')) {
      const giftProducts = availableProducts.filter(p => 
        p.occasions.includes('gift') || p.tags.includes('gift')
      ).slice(0, 4);
      
      return {
        response: this.getResponse('gift'),
        products: giftProducts,
        type: 'products'
      };
    }

    // Spice queries (English and Tamil)
    if (lowerInput.includes('spice') || lowerInput.includes('masala') || lowerInput.includes('cooking') || 
        lowerInput.includes('மசாலா') || lowerInput.includes('சமையல்')) {
      const spiceProducts = availableProducts.filter(p => 
        p.category.toLowerCase().includes('spice') ||
        p.name.toLowerCase().includes('spice') ||
        p.tags.some(tag => tag.toLowerCase().includes('spice'))
      );
      return {
        response: this.getResponse('spice'),
        products: spiceProducts,
        type: 'products'
      };
    }

    // Search for specific product names or keywords
    const searchTerms = lowerInput.split(' ').filter(word => word.length > 2);
    let matchingProducts: Product[] = [];
    
    for (const term of searchTerms) {
      const matches = availableProducts.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.origin.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term)) ||
        p.materials.some(material => material.toLowerCase().includes(term))
      );
      matchingProducts = [...matchingProducts, ...matches];
    }

    // Remove duplicates
    matchingProducts = matchingProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    if (matchingProducts.length > 0) {
      return {
        response: this.getResponse('newProducts', { count: availableProducts.length }),
        products: matchingProducts.slice(0, 6),
        type: 'products'
      };
    }

    // Default response with fresh products
    if (availableProducts.length === 0) {
      return {
        response: this.getResponse('noProducts'),
        products: [],
        type: 'products'
      };
    }

    const randomProducts = availableProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    return {
      response: this.getResponse('newProducts', { count: availableProducts.length }),
      products: randomProducts,
      type: 'products'
    };
  }

  async getRecommendations(preferences: { budget?: number; occasion?: string; category?: string }): Promise<Recommendation> {
    const availableProducts = await this.loadProducts();
    let filtered = availableProducts;

    if (preferences.budget) {
      filtered = filtered.filter(p => p.price <= preferences.budget);
    }

    if (preferences.occasion) {
      filtered = filtered.filter(p => p.occasions.includes(preferences.occasion.toLowerCase()));
    }

    if (preferences.category) {
      filtered = filtered.filter(p => p.category.toLowerCase().includes(preferences.category.toLowerCase()));
    }

    const recommended = filtered.slice(0, 6); // Show more recommendations
    
    return {
      products: recommended,
      reason: this.language === 'ta' 
        ? `உங்கள் விருப்பங்களின் அடிப்படையில், உங்கள் தேவைகளுக்கு சரியாக பொருந்தும் இந்த உண்மையான பொருட்களை நான் தேர்ந்தெடுத்துள்ளேன்.`
        : `Based on your preferences, I've selected these authentic pieces that perfectly match your needs.`,
      culturalContext: recommended.length > 0 ? recommended[0].culturalSignificance : undefined
    };
  }

  simulateVoiceProcessing(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 1500 + Math.random() * 1000);
    });
  }

}