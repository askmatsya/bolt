import { Product, Recommendation } from '../types';
import { products } from '../data/products';

export class AIMatsya {
  private products: Product[] = products;
  private language: 'en' | 'ta' = 'en';

  setLanguage(lang: 'en' | 'ta') {
    this.language = lang;
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
        default: `வணக்கம்! உண்மையான இந்திய பாரம்பரிய பொருட்களைக் கண்டறிய நான் இங்கே உதவ இருக்கிறேன். இந்திய கைவினைத்திறனின் அழகைக் காட்டும் எங்கள் சிறப்பு பொருட்களில் சில இங்கே உள்ளன. நீங்கள் எந்த குறிப்பிட்ட வகை பொருளைத் தேடுகிறீர்கள்?`
      }
    };

    return responses[this.language][key] || responses.en[key];
  }

  processVoiceInput(input: string): { response: string; products: Product[]; type: 'text' | 'products' | 'cultural' | 'order' } {
    const lowerInput = input.toLowerCase();
    
    // Detect language from input
    if (input.includes('திருமண') || input.includes('புடவை') || input.includes('நகை') || input.includes('மசாலா')) {
      this.language = 'ta';
    }
    
    // Wedding/Bridal queries (English and Tamil)
    if (lowerInput.includes('wedding') || lowerInput.includes('bridal') || lowerInput.includes('marriage') || 
        lowerInput.includes('திருமண') || lowerInput.includes('கல்யாண')) {
      const weddingProducts = this.products.filter(p => 
        p.occasions.includes('wedding') || p.tags.includes('bridal')
      );
      
      return {
        response: this.getResponse('wedding'),
        products: weddingProducts,
        type: 'products'
      };
    }

    // Budget-based queries
    const budgetMatch = lowerInput.match(/under (\d+)|below (\d+)|less than (\d+)|(\d+) rupees|₹(\d+)|(\d+) ரூபாய்/);
    if (budgetMatch) {
      const budget = parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4] || budgetMatch[5] || budgetMatch[6]);
      const budgetProducts = this.products.filter(p => p.price <= budget);
      
      return {
        response: this.getResponse('budget', { budget }),
        products: budgetProducts.slice(0, 3),
        type: 'products'
      };
    }

    // Category-specific queries (English and Tamil)
    if (lowerInput.includes('saree') || lowerInput.includes('புடவை')) {
      const sarees = this.products.filter(p => p.category === 'Sarees');
      return {
        response: this.getResponse('saree'),
        products: sarees,
        type: 'products'
      };
    }

    if (lowerInput.includes('jewelry') || lowerInput.includes('jewellery') || lowerInput.includes('நகை')) {
      const jewelry = this.products.filter(p => p.category === 'Jewelry');
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
      const culturalProduct = this.products[Math.floor(Math.random() * this.products.length)];
      return {
        response: this.getResponse('cultural', { 
          productName: culturalProduct.name, 
          significance: culturalProduct.culturalSignificance 
        }),
        products: [culturalProduct],
        type: 'cultural'
      };
    }

    // Gift queries (English and Tamil)
    if (lowerInput.includes('gift') || lowerInput.includes('present') || lowerInput.includes('பரிசு')) {
      const giftProducts = this.products.filter(p => p.occasions.includes('gift')).slice(0, 3);
      return {
        response: this.getResponse('gift'),
        products: giftProducts,
        type: 'products'
      };
    }

    // Spice queries (English and Tamil)
    if (lowerInput.includes('spice') || lowerInput.includes('masala') || lowerInput.includes('cooking') || 
        lowerInput.includes('மசாலா') || lowerInput.includes('சமையல்')) {
      const spiceProducts = this.products.filter(p => p.category === 'Spices');
      return {
        response: this.getResponse('spice'),
        products: spiceProducts,
        type: 'products'
      };
    }

    // Default response with mixed recommendations
    const randomProducts = this.products.sort(() => 0.5 - Math.random()).slice(0, 3);
    return {
      response: this.getResponse('default'),
      products: randomProducts,
      type: 'products'
    };
  }

  getRecommendations(preferences: { budget?: number; occasion?: string; category?: string }): Recommendation {
    let filtered = this.products;

    if (preferences.budget) {
      filtered = filtered.filter(p => p.price <= preferences.budget);
    }

    if (preferences.occasion) {
      filtered = filtered.filter(p => p.occasions.includes(preferences.occasion.toLowerCase()));
    }

    if (preferences.category) {
      filtered = filtered.filter(p => p.category === preferences.category);
    }

    const recommended = filtered.slice(0, 3);
    
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