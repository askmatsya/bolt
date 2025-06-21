import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product, Category, Artisan, Order } from '../types';

// Fallback data when Supabase is not configured
import { sampleProducts } from '../data/products';

export const database = {
  async getAll<T>(table: string): Promise<T[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using sample data')
      if (table === 'products') {
        return sampleProducts as T[]
      }
      return []
    }

    try {
      const { data, error } = await supabase.from(table).select('*')
      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Failed to fetch from ${table}:`, error)
      // Return sample data for products if real fetch fails
      if (table === 'products') {
        return sampleProducts as T[]
      }
      return []
    }
  },

  async getById<T>(table: string, id: string): Promise<T | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using sample data')
      if (table === 'products') {
        const product = sampleProducts.find(p => p.id === id)
        return (product as T) || null
      }
      return null
    }

    try {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
      if (error) throw error
      return data
    } catch (error) {
      console.error(`Failed to fetch ${table} by id ${id}:`, error)
      if (table === 'products') {
        const product = sampleProducts.find(p => p.id === id)
        return (product as T) || null
      }
      return null
    }
  },

  async create<T>(table: string, data: Partial<T>): Promise<T | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot create data')
      throw new Error('Database not configured. Please set up Supabase connection.')
    }

    try {
      const { data: result, error } = await supabase.from(table).insert(data).select().single()
      if (error) throw error
      return result
    } catch (error) {
      console.error(`Failed to create in ${table}:`, error)
      throw error
    }
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot update data')
      throw new Error('Database not configured. Please set up Supabase connection.')
    }

    try {
      const { data: result, error } = await supabase.from(table).update(data).eq('id', id).select().single()
      if (error) throw error
      return result
    } catch (error) {
      console.error(`Failed to update ${table} with id ${id}:`, error)
      throw error
    }
  },

  async delete(table: string, id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, cannot delete data')
      throw new Error('Database not configured. Please set up Supabase connection.')
    }

    try {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      return true
    } catch (error) {
      console.error(`Failed to delete from ${table} with id ${id}:`, error)
      throw error
    }
  },

  // Specific methods for products
  async getProducts(): Promise<Product[]> {
    return this.getAll<Product>('products')
  },

  async searchProducts(query: string): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, searching sample data')
      const lowerQuery = query.toLowerCase()
      return sampleProducts.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (name, slug),
          artisans (name, location, rating)
        `)
        .textSearch('fts', query)
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Search failed:', error)
      // Fallback to local search
      const lowerQuery = query.toLowerCase()
      return sampleProducts.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }
  },

  async getCategories(): Promise<Category[]> {
    return this.getAll<Category>('categories')
  },

  async getArtisans(): Promise<Artisan[]> {
    return this.getAll<Artisan>('artisans')
  },

  async createOrder(orderData: Partial<Order>): Promise<Order | null> {
    return this.create<Order>('orders', orderData)
  }
}