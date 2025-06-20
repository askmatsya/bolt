import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Declare supabase variable at top level
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Some features may not work.');
  // Create a mock client for development
  const mockClient = {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          order: () => ({ 
            data: [], 
            error: new Error('Supabase not configured') 
          }) 
        })
      }),
      insert: () => ({ 
        select: () => ({ 
          single: () => ({ 
            data: null, 
            error: new Error('Supabase not configured') 
          }) 
        })
      }),
      update: () => ({ 
        eq: () => ({ 
          data: null, 
          error: new Error('Supabase not configured') 
        })
      })
    }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null })
    }
  };
  
  supabase = mockClient;
} else {
  // Create Supabase client with security options
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'askmatsya-voice-bot'
      }
    }
  });
}

// Export at top level
export { supabase };

// Helper function to check connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    return { 
      success: false, 
      message: `Database connection failed: ${error.message}` 
    };
  }
};

// Helper function for authenticated requests
export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};