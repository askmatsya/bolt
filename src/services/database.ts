import { supabase } from '../lib/supabase';
import { Database } from '../types/database';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type UserInteraction = Database['public']['Tables']['user_interactions']['Insert'];
type Order = Database['public']['Tables']['orders']['Insert'];

// Product Services
export const productService = {
  // Get all active products
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        artisans (name, location, rating)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get products by category
  async getByCategory(categorySlug: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner (name, slug),
        artisans (name, location, rating)
      `)
      .eq('categories.slug', categorySlug)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  // Search products
  async search(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
  }): Promise<Product[]> {
    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        artisans (name, location, rating)
      `)
      .eq('is_active', true);

    // Text search
    if (query) {
      queryBuilder = queryBuilder.textSearch('name', query);
    }

    // Apply filters
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('categories.slug', filters.category);
    }
    
    if (filters?.minPrice) {
      queryBuilder = queryBuilder.gte('price', filters.minPrice);
    }
    
    if (filters?.maxPrice) {
      queryBuilder = queryBuilder.lte('price', filters.maxPrice);
    }

    if (filters?.tags && filters.tags.length > 0) {
      queryBuilder = queryBuilder.overlaps('tags', filters.tags);
    }

    const { data, error } = await queryBuilder.limit(20);

    if (error) throw error;
    return data || [];
  },

  // Get product by ID
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        artisans (name, location, rating, bio, specialization)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }
};

// Category Services
export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  },

  async getWithProductCounts(): Promise<(Category & { product_count: number })[]> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products!inner (count)
      `)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data || [];
  }
};

// Analytics Services
export const analyticsService = {
  async trackInteraction(interaction: UserInteraction): Promise<void> {
    const { error } = await supabase
      .from('user_interactions')
      .insert(interaction);

    if (error) {
      console.error('Failed to track interaction:', error);
      // Don't throw error for analytics - fail silently
    }
  },

  async trackVoiceQuery(
    sessionId: string,
    query: string,
    transcript: string,
    language: 'en' | 'ta',
    responseData?: any
  ): Promise<void> {
    await this.trackInteraction({
      session_id: sessionId,
      interaction_type: 'voice_query',
      query_text: query,
      voice_transcript: transcript,
      language,
      response_data: responseData,
      user_agent: navigator.userAgent
    });
  },

  async trackProductView(
    sessionId: string,
    productId: string,
    language: 'en' | 'ta'
  ): Promise<void> {
    await this.trackInteraction({
      session_id: sessionId,
      interaction_type: 'product_view',
      product_id: productId,
      language,
      user_agent: navigator.userAgent
    });
  }
};

// Order Services
export const orderService = {
  async create(order: Order): Promise<string> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  async getBySessionId(sessionId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (name, image_url, price_range)
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Utility function to generate session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};