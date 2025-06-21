import React, { useState } from 'react';
import { X, Phone, MessageCircle, CheckCircle, Clock, Send } from 'lucide-react';
import { Product } from '../types';
import { whatsappService, calculateEstimatedDelivery } from '../services/whatsapp';
import { supabase } from '../lib/supabase';
import { generateSessionId } from '../services/database';

interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'ta';
}

export const OrderModal: React.FC<OrderModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  language = 'en' 
}) => {
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    preferredContact: 'whatsapp'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmitting(true);
    
    try {
      // Create order in database
      const orderData = {
        session_id: generateSessionId(),
        product_id: product.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        preferred_contact: formData.preferredContact as 'whatsapp' | 'call',
        status: 'pending' as const,
        order_notes: null,
        total_amount: product.price,
      };

      const { data: order, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      setStep('confirmation');

      // Send WhatsApp confirmation
      setTimeout(async () => {
        try {
          const confirmationData = {
            orderId: order.id,
            customerName: formData.name,
            customerPhone: formData.phone,
            productName: product.name,
            price: product.priceRange,
            artisan: product.artisan,
            estimatedDelivery: calculateEstimatedDelivery(product.craftTime),
          };

          const whatsappSuccess = await whatsappService.sendOrderConfirmation(
            confirmationData, 
            language
          );

          if (whatsappSuccess) {
            setWhatsappSent(true);
            
            // Notify admin about new order
            await whatsappService.notifyAdminNewOrder(confirmationData);
          }

          setStep('success');
        } catch (error) {
          console.error('WhatsApp confirmation error:', error);
          setStep('success'); // Still show success even if WhatsApp fails
        }
      }, 2000);

    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectWhatsApp = () => {
    if (!product) return;
    
    const message = language === 'ta' 
      ? `வணக்கம்! நான் AskMatsya-ல் இருந்து ${product.name} (${product.priceRange}) ஆர்டர் செய்ய விரும்புகிறேன். கிடைக்கும் தன்மை மற்றும் டெலிவரி பற்றி மேலும் விவரங்களை தயவுசெய்து தெரிவிக்கவும்.`
      : `Hi! I'm interested in ordering: ${product.name} (${product.priceRange}) from AskMatsya. Please provide more details about availability and delivery.`;
    
    const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  const getStepText = (key: string) => {
    const texts = {
      en: {
        orderDetails: 'Order Details',
        processingOrder: 'Processing Order...',
        orderConfirmed: 'Order Confirmed!',
        fullName: 'Full Name',
        phoneNumber: 'Phone Number',
        deliveryAddress: 'Delivery Address',
        preferredContact: 'Preferred Contact Method',
        whatsappRecommended: 'WhatsApp (Recommended)',
        phoneCall: 'Phone Call',
        orderProcess: 'Order Process',
        confirmOrder: 'Confirm Order',
        orOrderDirectly: 'Or order directly via',
        whatsappNow: 'WhatsApp Now',
        processingYourOrder: 'Processing Your Order',
        pleaseWait: 'Please wait while we confirm your order details...',
        orderConfirmedSuccess: 'Order Confirmed!',
        continueShoppping: 'Continue Shopping'
      },
      ta: {
        orderDetails: 'ஆர்டர் விவரங்கள்',
        processingOrder: 'ஆர்டரை செயலாக்குகிறது...',
        orderConfirmed: 'ஆர்டர் உறுதிப்படுத்தப்பட்டது!',
        fullName: 'முழு பெயர்',
        phoneNumber: 'தொலைபேசி எண்',
        deliveryAddress: 'டெலிவரி முகவரி',
        preferredContact: 'விரும்பிய தொடர்பு முறை',
        whatsappRecommended: 'WhatsApp (பரிந்துரைக்கப்படுகிறது)',
        phoneCall: 'தொலைபேசி அழைப்பு',
        orderProcess: 'ஆர்டர் செயல்முறை',
        confirmOrder: 'ஆர்டரை உறுதிப்படுத்தவும்',
        orOrderDirectly: 'அல்லது நேரடியாக ஆர்டர் செய்யவும்',
        whatsappNow: 'இப்போது WhatsApp',
        processingYourOrder: 'உங்கள் ஆர்டரை செயலாக்குகிறது',
        pleaseWait: 'உங்கள் ஆர்டர் விவரங்களை உறுதிப்படுத்தும் வரை காத்திருக்கவும்...',
        orderConfirmedSuccess: 'ஆர்டர் உறுதிப்படுத்தப்பட்டது!',
        continueShoppping: 'கொள்முதல் தொடரவும்'
      }
    };
    return texts[language][key] || texts.en[key];
  };

  const resetAndClose = () => {
    setStep('details');
    setFormData({ name: '', phone: '', address: '', preferredContact: 'whatsapp' });
    setWhatsappSent(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 'details' && getStepText('orderDetails')}
            {step === 'confirmation' && getStepText('processingOrder')}
            {step === 'success' && getStepText('orderConfirmed')}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getStepText('fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={language === 'ta' ? 'உங்கள் முழு பெயரை உள்ளிடவும்' : 'Enter your full name'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getStepText('phoneNumber')}
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getStepText('deliveryAddress')}
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={language === 'ta' ? 'உங்கள் முழு டெலிவரி முகவரியை உள்ளிடவும்' : 'Enter your complete delivery address'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getStepText('preferredContact')}
                  </label>
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
                      {getStepText('whatsappRecommended')}
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
                      {getStepText('phoneCall')}
                    </label>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {getStepText('orderProcess')}
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• {language === 'ta' ? 'எங்கள் குழு 24 மணி நேரத்திற்குள் உங்களை தொடர்பு கொள்ளும்' : 'Our team will contact you within 24 hours'}</li>
                    <li>• {language === 'ta' ? 'பொருளின் கிடைக்கும் தன்மை மற்றும் இறுதி விலையை உறுதிப்படுத்துவோம்' : 'We\'ll confirm product availability and final pricing'}</li>
                    <li>• {language === 'ta' ? 'UPI, கார்டு அல்லது டெலிவரியில் பணம் செலுத்தலாம்' : 'Payment can be made via UPI, card, or cash on delivery'}</li>
                    <li>• {language === 'ta' ? 'டெலிவரி நேரம்: இருப்பிடத்தைப் பொறுத்து 5-15 நாட்கள்' : 'Delivery time: 5-15 days depending on location'}</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white rounded-xl py-4 px-6 text-lg font-semibold transition-all duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      {language === 'ta' ? 'ஆர்டரை உருவாக்குகிறது...' : 'Creating Order...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {getStepText('confirmOrder')}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="border-t border-gray-300 flex-1"></div>
                  <span className="px-4 text-gray-500 text-sm">{getStepText('orOrderDirectly')}</span>
                  <div className="border-t border-gray-300 flex-1"></div>
                </div>
                <button
                  onClick={handleDirectWhatsApp}
                  className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 px-6 font-semibold transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {getStepText('whatsappNow')}
                </button>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {getStepText('processingYourOrder')}
              </h3>
              <p className="text-gray-600 mb-4">
                {getStepText('pleaseWait')}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  📱 {language === 'ta' 
                    ? 'WhatsApp உறுதிப்படுத்தல் செய்தி அனுப்பப்படுகிறது...'
                    : 'Sending WhatsApp confirmation message...'
                  }
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {getStepText('orderConfirmedSuccess')}
              </h3>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <p className="text-green-800 mb-2">
                  <strong>{language === 'ta' ? 'ஆர்டர் ID:' : 'Order ID:'}</strong> #AskMatsya{Math.floor(Math.random() * 10000)}
                </p>
                <p className="text-green-700 mb-4">
                  {language === 'ta' 
                    ? `நன்றி ${formData.name}! ${product.name} க்கான உங்கள் ஆர்டரை உறுதிப்படுத்த 24 மணி நேரத்திற்குள் ${formData.phone} இல் உங்களை தொடர்பு கொள்வோம்.`
                    : `Thank you ${formData.name}! We'll contact you on ${formData.phone} within 24 hours to confirm your order for ${product.name}.`
                  }
                </p>
                
                {whatsappSent && (
                  <div className="bg-white border border-green-300 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">
                        ✅ {language === 'ta' ? 'WhatsApp உறுதிப்படுத்தல் அனுப்பப்பட்டது!' : 'WhatsApp confirmation sent!'}
                      </span>
                    </div>
                    <p className="text-green-600 text-sm">
                      {language === 'ta' 
                        ? 'உங்கள் WhatsApp இல் ஆர்டர் விவரங்களைப் பார்க்கவும்'
                        : 'Check your WhatsApp for order details'
                      }
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-600">
                  {language === 'ta' ? 'நீங்கள் பெறுவீர்கள்:' : 'You\'ll receive:'}
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>📱 {language === 'ta' ? 'WhatsApp உறுதிப்படுத்தல் செய்தி' : 'WhatsApp confirmation message'}</li>
                  <li>📞 {language === 'ta' ? 'எங்கள் கைவினைஞர் பங்குதாரருடன் அழைப்பு' : 'Call from our artisan partner'}</li>
                  <li>📦 {language === 'ta' ? 'அனுப்பப்பட்ட பிறகு கண்காணிப்பு விவரங்கள்' : 'Tracking details once shipped'}</li>
                  <li>✨ {language === 'ta' ? 'தனிப்பயனாக்கப்பட்ட கைவினைப் பொருள்' : 'Personalized handcrafted item'}</li>
                </ul>
              </div>
              
              <button
                onClick={resetAndClose}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 px-8 font-semibold transition-colors duration-200"
              >
                {getStepText('continueShoppping')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};