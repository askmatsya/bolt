import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load orders with error handling
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          products (name, image_url, price_range)
        `);

      if (ordersError) {
        console.error('Orders error:', ordersError);
      }

      // Load products with error handling
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) {
        console.error('Products error:', productsError);
      }

      // Calculate stats with null checks
      const totalOrders = orders?.length || 0;
      const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.is_active).length || 0;
      
      // Calculate total revenue with proper error handling
      const totalRevenue = orders?.reduce((sum, order) => {
        if (order.total_amount) {
          return sum + parseFloat(order.total_amount);
        }
        // Fallback to extracting from price_range
        const priceMatch = order.products?.price_range?.match(/₹([\d,]+)/);
        const price = priceMatch ? parseInt(priceMatch[1].replace(',', '')) : 0;
        return sum + price;
      }, 0) || 0;

      // Get recent orders (last 5)
      const recentOrders = orders?.slice(0, 5) || [];

      // Get top products (first 5 active products)
      const topProducts = products?.filter(p => p.is_active).slice(0, 5) || [];

      setStats({
        totalOrders,
        pendingOrders,
        totalProducts,
        activeProducts,
        totalRevenue,
        recentOrders,
        topProducts,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Dashboard Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.totalOrders}</h3>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.pendingOrders}</h3>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{stats.activeProducts}</h3>
              <p className="text-sm text-gray-600">Active Products</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {order.products?.image_url ? (
                      <img 
                        src={order.products.image_url} 
                        alt={order.products?.name || 'Product'}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-sm text-gray-600">{order.products?.name || 'Product'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500">Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-4 text-left transition-colors">
              <div className="flex items-center">
                <Plus className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Add New Product</p>
                  <p className="text-sm text-orange-100">Expand your catalog</p>
                </div>
              </div>
            </button>
            
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 text-left transition-colors">
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Process Orders</p>
                  <p className="text-sm text-blue-100">Update order statuses</p>
                </div>
              </div>
            </button>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 text-left transition-colors">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-green-100">Track performance</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {stats.pendingOrders > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800">Attention Required</h4>
              <p className="text-yellow-700">
                You have {stats.pendingOrders} pending orders that need your attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};