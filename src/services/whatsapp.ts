// WhatsApp integration service for order confirmations
import { supabase } from '../lib/supabase';

export interface WhatsAppMessage {
  to: string;
  message: string;
  orderId: string;
  customerName: string;
}

export interface OrderConfirmation {
  orderId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  price: string;
  artisan?: string;
  estimatedDelivery: string;
}

class WhatsAppService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    // Using a WhatsApp Business API service (you can replace with Twilio, etc.)
    this.apiUrl = 'https://api.ultramsg.com'; // Example API
    this.apiKey = import.meta.env.VITE_WHATSAPP_API_KEY || '';
  }

  // Format Indian phone number for WhatsApp
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // If starts with 91, use as is
    if (cleaned.startsWith('91')) {
      return cleaned;
    }
    
    // If starts with 0, replace with 91
    if (cleaned.startsWith('0')) {
      return '91' + cleaned.substring(1);
    }
    
    // If 10 digits, add 91 prefix
    if (cleaned.length === 10) {
      return '91' + cleaned;
    }
    
    return cleaned;
  }

  // Generate order confirmation message
  private generateConfirmationMessage(order: OrderConfirmation, language: 'en' | 'ta' = 'en'): string {
    if (language === 'ta') {
      return `🙏 வணக்கம் ${order.customerName}!

AskMatsya-வில் உங்கள் ஆர்டரை உறுதிப்படுத்துகிறோம்!

📦 *ஆர்டர் விவரங்கள்:*
🆔 ஆர்டர் ID: #${order.orderId.slice(-8)}
🛍️ பொருள்: ${order.productName}
💰 விலை: ${order.price}
${order.artisan ? `👨‍🎨 கைவினைஞர்: ${order.artisan}` : ''}
🚚 எதிர்பார்க்கப்படும் டெலிவரி: ${order.estimatedDelivery}

✅ உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது!

எங்கள் குழு விரைவில் உங்களை தொடர்பு கொண்டு:
• பொருளின் கிடைக்கும் தன்மையை உறுதிப்படுத்தும்
• இறுதி விலை மற்றும் டெலிவரி விவரங்களை தெரிவிக்கும்
• கட்டண விருப்பங்களைப் பற்றி விளக்கும்

❓ கேள்விகள் உள்ளதா? இந்த எண்ணுக்கு பதிலளிக்கவும்!

நன்றி! 🛍️✨
- AskMatsya குழு`;
    }

    return `🙏 Namaste ${order.customerName}!

Your order with AskMatsya has been confirmed!

📦 *Order Details:*
🆔 Order ID: #${order.orderId.slice(-8)}
🛍️ Product: ${order.productName}
💰 Price: ${order.price}
${order.artisan ? `👨‍🎨 Artisan: ${order.artisan}` : ''}
🚚 Expected Delivery: ${order.estimatedDelivery}

✅ Your order has been successfully registered!

Our team will contact you shortly to:
• Confirm product availability
• Share final pricing and delivery details
• Discuss payment options

❓ Have questions? Reply to this number!

Thank you for choosing authentic Indian crafts! 🛍️✨
- Team AskMatsya`;
  }

  // Send WhatsApp message using API
  async sendMessage(to: string, message: string): Promise<boolean> {
    // If no API key, fall back to WhatsApp Web link
    if (!this.apiKey) {
      const whatsappWebUrl = `https://wa.me/${this.formatPhoneNumber(to)}?text=${encodeURIComponent(message)}`;
      console.log('WhatsApp Web URL:', whatsappWebUrl);
      window.open(whatsappWebUrl, '_blank');
      return true;
    }

    try {
      const response = await fetch(`${this.apiUrl}/instance/sendChatMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          to: this.formatPhoneNumber(to),
          body: message,
        }),
      });

      const result = await response.json();
      return response.ok && result.sent;
    } catch (error) {
      console.error('WhatsApp API error:', error);
      
      // Fallback to WhatsApp Web
      const whatsappWebUrl = `https://wa.me/${this.formatPhoneNumber(to)}?text=${encodeURIComponent(message)}`;
      window.open(whatsappWebUrl, '_blank');
      return true;
    }
  }

  // Send order confirmation
  async sendOrderConfirmation(order: OrderConfirmation, language: 'en' | 'ta' = 'en'): Promise<boolean> {
    const message = this.generateConfirmationMessage(order, language);
    
    try {
      // Log the confirmation for admin tracking
      await this.logWhatsAppMessage({
        to: order.customerPhone,
        message,
        orderId: order.orderId,
        customerName: order.customerName,
      });

      return await this.sendMessage(order.customerPhone, message);
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
      return false;
    }
  }

  // Log WhatsApp messages for tracking
  private async logWhatsAppMessage(messageData: WhatsAppMessage): Promise<void> {
    try {
      await supabase.from('user_interactions').insert({
        session_id: `whatsapp_${Date.now()}`,
        interaction_type: 'order_intent',
        query_text: `WhatsApp confirmation sent to ${messageData.customerName}`,
        response_data: {
          type: 'whatsapp_confirmation',
          orderId: messageData.orderId,
          to: messageData.to,
          messageLength: messageData.message.length,
        },
        language: 'en',
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to log WhatsApp message:', error);
    }
  }

  // Send notification to admin about new order
  async notifyAdminNewOrder(order: OrderConfirmation): Promise<void> {
    const adminMessage = `🚨 *New Order Alert!*

📦 Order: #${order.orderId.slice(-8)}
👤 Customer: ${order.customerName}
📱 Phone: ${order.customerPhone}
🛍️ Product: ${order.productName}
💰 Price: ${order.price}

Please process this order and contact the customer.

AskMatsya Admin Panel: ${window.location.origin}/admin`;

    // Send to admin number (you can configure this)
    const adminPhone = '+919876543210'; // Replace with actual admin number
    
    try {
      await this.sendMessage(adminPhone, adminMessage);
    } catch (error) {
      console.error('Failed to notify admin:', error);
    }
  }
}

export const whatsappService = new WhatsAppService();

// Helper function to calculate estimated delivery
export function calculateEstimatedDelivery(craftTime?: string): string {
  const now = new Date();
  let deliveryDays = 7; // Default 1 week

  if (craftTime) {
    // Parse craft time to estimate delivery
    const timeStr = craftTime.toLowerCase();
    if (timeStr.includes('60') || timeStr.includes('45-60')) {
      deliveryDays = 75; // ~10-11 weeks
    } else if (timeStr.includes('45') || timeStr.includes('30-45')) {
      deliveryDays = 60; // ~8-9 weeks
    } else if (timeStr.includes('30')) {
      deliveryDays = 45; // ~6-7 weeks
    } else if (timeStr.includes('20')) {
      deliveryDays = 30; // ~4-5 weeks
    } else if (timeStr.includes('15')) {
      deliveryDays = 25; // ~3-4 weeks
    } else if (timeStr.includes('7') || timeStr.includes('10')) {
      deliveryDays = 14; // ~2-3 weeks
    }
  }

  const deliveryDate = new Date(now.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
  return deliveryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}