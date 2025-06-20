export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          description: string;
          cultural_significance: string;
          price: number;
          price_range: string;
          origin: string;
          artisan_id: string | null;
          image_url: string;
          tags: string[];
          occasions: string[];
          materials: string[];
          craft_time: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          description: string;
          cultural_significance: string;
          price: number;
          price_range: string;
          origin: string;
          artisan_id?: string | null;
          image_url: string;
          tags: string[];
          occasions: string[];
          materials: string[];
          craft_time?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          description?: string;
          cultural_significance?: string;
          price?: number;
          price_range?: string;
          origin?: string;
          artisan_id?: string | null;
          image_url?: string;
          tags?: string[];
          occasions?: string[];
          materials?: string[];
          craft_time?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          parent_id: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_interactions: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          interaction_type: 'voice_query' | 'product_view' | 'product_like' | 'order_intent' | 'cultural_interest';
          query_text: string | null;
          voice_transcript: string | null;
          product_id: string | null;
          response_data: any | null;
          language: 'en' | 'ta';
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          interaction_type: 'voice_query' | 'product_view' | 'product_like' | 'order_intent' | 'cultural_interest';
          query_text?: string | null;
          voice_transcript?: string | null;
          product_id?: string | null;
          response_data?: any | null;
          language?: 'en' | 'ta';
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string;
          interaction_type?: 'voice_query' | 'product_view' | 'product_like' | 'order_intent' | 'cultural_interest';
          query_text?: string | null;
          voice_transcript?: string | null;
          product_id?: string | null;
          response_data?: any | null;
          language?: 'en' | 'ta';
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      voice_intents: {
        Row: {
          id: string;
          intent_name: string;
          sample_phrases: string[];
          expected_entities: string[];
          response_template: string;
          language: 'en' | 'ta';
          confidence_threshold: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intent_name: string;
          sample_phrases: string[];
          expected_entities: string[];
          response_template: string;
          language?: 'en' | 'ta';
          confidence_threshold?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intent_name?: string;
          sample_phrases?: string[];
          expected_entities?: string[];
          response_template?: string;
          language?: 'en' | 'ta';
          confidence_threshold?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      artisans: {
        Row: {
          id: string;
          name: string;
          bio: string | null;
          location: string;
          specialization: string[];
          contact_info: any | null;
          verification_status: 'pending' | 'verified' | 'rejected';
          rating: number | null;
          total_products: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          bio?: string | null;
          location: string;
          specialization: string[];
          contact_info?: any | null;
          verification_status?: 'pending' | 'verified' | 'rejected';
          rating?: number | null;
          total_products?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          bio?: string | null;
          location?: string;
          specialization?: string[];
          contact_info?: any | null;
          verification_status?: 'pending' | 'verified' | 'rejected';
          rating?: number | null;
          total_products?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          product_id: string;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          preferred_contact: 'whatsapp' | 'call';
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          order_notes: string | null;
          total_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          product_id: string;
          customer_name: string;
          customer_phone: string;
          customer_address: string;
          preferred_contact: 'whatsapp' | 'call';
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          order_notes?: string | null;
          total_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string;
          product_id?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_address?: string;
          preferred_contact?: 'whatsapp' | 'call';
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          order_notes?: string | null;
          total_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}