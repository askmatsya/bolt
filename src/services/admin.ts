import { supabase } from '../lib/supabase';

// Order Management Services
export const orderService = {
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (name, image_url, price_range)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data;
  },

  async getOrdersByStatus(status: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products (name, image_url, price_range)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('status');

    if (error) throw error;

    const stats = data.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: data.length,
      pending: stats.pending || 0,
      confirmed: stats.confirmed || 0,
      processing: stats.processing || 0,
      shipped: stats.shipped || 0,
      delivered: stats.delivered || 0,
      cancelled: stats.cancelled || 0,
    };
  }
};

// Product Management Services
export const productService = {
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        artisans (name, location)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateProductStatus(productId: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('products')
      .update({ is_active: isActive })
      .eq('id', productId)
      .select();

    if (error) throw error;
    return data;
  },

  async updateProduct(productId: string, updates: any) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select();

    if (error) throw error;
    return data;
  },

  async createProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select();

    if (error) throw error;
    return data;
  },

  async getProductStats() {
    const { data, error } = await supabase
      .from('products')
      .select('is_active');

    if (error) throw error;

    return {
      total: data.length,
      active: data.filter(p => p.is_active).length,
      inactive: data.filter(p => !p.is_active).length,
    };
  }
};

// Category Management Services
export const categoryService = {
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }
};

// Analytics Services
export const analyticsService = {
  async getDashboardStats() {
    try {
      const [orders, products] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts()
      ]);

      const orderStats = await orderService.getOrderStats();
      const productStats = await productService.getProductStats();

      // Calculate revenue (simplified)
      const totalRevenue = orders.reduce((sum, order) => {
        const priceMatch = order.products?.price_range?.match(/₹([\d,]+)/);
        const price = priceMatch ? parseInt(priceMatch[1].replace(',', '')) : 0;
        return sum + price;
      }, 0);

      return {
        orders: orderStats,
        products: productStats,
        revenue: totalRevenue,
        recentOrders: orders.slice(0, 5),
        topProducts: products.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};