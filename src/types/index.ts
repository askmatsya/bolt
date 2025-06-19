export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  culturalSignificance: string;
  price: number;
  priceRange: string;
  origin: string;
  artisan?: string;
  image: string;
  tags: string[];
  occasions: string[];
  materials: string[];
  craftTime?: string;
}

export interface Conversation {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  products?: Product[];
  type?: 'text' | 'products' | 'cultural' | 'order';
}

export interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  volume: number;
}

export interface Recommendation {
  products: Product[];
  reason: string;
  culturalContext?: string;
}