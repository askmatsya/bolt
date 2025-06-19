import React, { useState } from 'react';
import { X, Phone, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { Product } from '../types';

interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ product, isOpen, onClose }) => {
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    preferredContact: 'whatsapp'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
    
    // Simulate order processing
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const resetAndClose = () => {
    setStep('details');
    setFormData({ name: '', phone: '', address: '', preferredContact: 'whatsapp' });
    onClose();
  };

  if (!isOpen || !product) return null;

  const whatsappMessage = `Hi! I'm interested in ordering: ${product.name} (${product.priceRange}) from AskMatsya. Please provide more details about availability and delivery.`;
  const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 'details' && 'Order Details'}
            {step === 'confirmation' && 'Processing Order...'}
            {step === 'success' && 'Order Confirmed!'}
          </h2>
          <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'details' && (
            <div>
              <div className="flex items-center mb-6 p-4 bg-orange-50 rounded-xl">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-orange-600 font-bold">{product.priceRange}</p>
                  <p className="text-sm text-gray-600">From {product.origin}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your complete delivery address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="whatsapp"
                        checked={formData.preferredContact === 'whatsapp'}
                        onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                        className="mr-3"
                      />
                      <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
                      WhatsApp (Recommended)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="call"
                        checked={formData.preferredContact === 'call'}
                        onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                        className="mr-3"
                      />
                      <Phone className="w-5 h-5 text-blue-600 mr-2" />
                      Phone Call
                    </label>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Order Process</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Our team will contact you within 24 hours</li>
                    <li>• We'll confirm product availability and final pricing</li>
                    <li>• Payment can be made via UPI, card, or cash on delivery</li>
                    <li>• Delivery time: 5-15 days depending on location</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl py-4 px-6 text-lg font-semibold transition-all duration-200"
                >
                  Confirm Order
                </button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="border-t border-gray-300 flex-1"></div>
                  <span className="px-4 text-gray-500 text-sm">Or order directly via</span>
                  <div className="border-t border-gray-300 flex-1"></div>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 px-6 font-semibold transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Now
                </a>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Your Order</h3>
              <p className="text-gray-600">Please wait while we confirm your order details...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <p className="text-green-800 mb-2">
                  <strong>Order ID:</strong> #AskMatsya{Math.floor(Math.random() * 10000)}
                </p>
                <p className="text-green-700">
                  Thank you {formData.name}! We'll contact you on {formData.phone} within 24 hours to confirm your order for <strong>{product.name}</strong>.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">You'll receive:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>📱 WhatsApp confirmation message</li>
                  <li>📧 Email with order details</li>
                  <li>📞 Call from our artisan partner</li>
                  <li>📦 Tracking details once shipped</li>
                </ul>
              </div>
              <button
                onClick={resetAndClose}
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 px-8 font-semibold transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};