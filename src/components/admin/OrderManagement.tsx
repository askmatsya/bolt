import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Phone, 
  MessageCircle, 
  Send,
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { whatsappService } from '../../services/whatsapp';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  preferred_contact: 'whatsapp' | 'call';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_notes: string | null;
  total_amount: number | null;
  created_at: string;
  products: {
    name: string;
    image_url: string;
    price_range: string;
  } | null;
}

const statusConfig = {
  pending: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-500', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'bg-purple-500', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-indigo-500', icon: Package, label: 'Shipped' },
  delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-500', icon: XCircle, label: 'Cancelled' },
};

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (name, image_url, price_range)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders. Please check your database connection.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus as any } : order
      ));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const sendWhatsAppUpdate = async (order: Order) => {
    if (!order.products?.name) return;
    
    setSendingWhatsApp(order.id);
    
    try {
      const success = await whatsappService.sendOrderStatusUpdate(
        order.customer_phone,
        order.id,
        order.status,
        'en' // You could detect language from order data
      );
      
      if (success) {
        alert('WhatsApp status update sent successfully!');
      } else {
        alert('WhatsApp message sent via fallback method');
      }
    } catch (error) {
      console.error('Failed to send WhatsApp update:', error);
      alert('Failed to send WhatsApp update');
    } finally {
      setSendingWhatsApp(null);
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const statusCounts = getStatusCounts();

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
          <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Orders Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadOrders}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <button
            onClick={loadOrders}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
        
        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Orders', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
            { key: 'processing', label: 'Processing', count: statusCounts.processing },
            { key: 'shipped', label: 'Shipped', count: statusCounts.shipped },
            { key: 'delivered', label: 'Delivered', count: statusCounts.delivered },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === filter.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
          </h3>
          <p className="text-gray-600">
            {statusFilter === 'all' 
              ? 'Orders will appear here once customers start placing them.' 
              : `No orders with status "${statusFilter}" found.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            
            return (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${statusConfig[order.status].color}`}></div>
                    <span className="font-semibold text-gray-900">#{order.id.slice(-8)}</span>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-white ${statusConfig[order.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig[order.status].label}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Details
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Customer</h4>
                    <p className="text-gray-600">{order.customer_name}</p>
                    <p className="text-gray-600">{order.customer_phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Product</h4>
                    <p className="text-gray-600">{order.products?.name || 'Product not found'}</p>
                    <p className="text-orange-600 font-medium">{(order.products?.price_range || 'Price not available').replace('₹', '$')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Order Date</h4>
                    <p className="text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Order #{selectedOrder.id.slice(-8)}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Product Image and Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                  {selectedOrder.products?.image_url ? (
                    <img 
                      src={selectedOrder.products.image_url} 
                      alt={selectedOrder.products?.name || 'Product'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedOrder.products?.name || 'Product not found'}</h4>
                    <p className="text-orange-600 font-medium">{(selectedOrder.products?.price_range || 'Price not available').replace('₹', '$')}</p>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Name:</span> {selectedOrder.customer_name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span> {selectedOrder.customer_phone}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Preferred Contact:</span> {selectedOrder.preferred_contact}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                  <p className="text-gray-600">{selectedOrder.customer_address}</p>
                </div>

                {selectedOrder.order_notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
                    <p className="text-gray-600">{selectedOrder.order_notes}</p>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="flex space-x-3 mb-6">
                <a
                  href={`tel:${selectedOrder.customer_phone}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-3 text-center font-medium"
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  Call Customer
                </a>
                <a
                  href={`https://wa.me/${selectedOrder.customer_phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg p-3 text-center font-medium"
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  WhatsApp
                </a>
                
                <button
                  onClick={() => sendWhatsAppUpdate(selectedOrder)}
                  disabled={sendingWhatsApp === selectedOrder.id}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg p-3 text-center font-medium"
                >
                  {sendingWhatsApp === selectedOrder.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 inline mr-2" />
                      Send Status Update
                    </>
                  )}
                </button>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Update Order Status</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(statusConfig).map(([status, config]) => {
                    const StatusIcon = config.icon;
                    const isCurrentStatus = selectedOrder.status === status;
                    const isUpdating = updating === selectedOrder.id;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={isCurrentStatus || isUpdating}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isCurrentStatus
                            ? `${config.color} text-white`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <StatusIcon className="w-4 h-4 inline mr-2" />
                        {config.label}
                        {isUpdating && <span className="ml-2">...</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};