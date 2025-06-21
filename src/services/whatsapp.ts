// WhatsApp Business API integration service for real order confirmations
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
  private apiKey: string;
  private phoneNumberId: string;
  private businessAccountId: string;
  private adminPhone: string;
  private baseUrl: string = 'https://graph.facebook.com/v18.0';

  constructor() {
    this.apiKey = import.meta.env.VITE_WHATSAPP_API_KEY || '';
    this.phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
    this.businessAccountId = import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID || '';
    this.adminPhone = import.meta.env.VITE_ADMIN_WHATSAPP || '+919876543210';
    
    console.log('WhatsApp Service initialized:', {
      hasApiKey: !!this.apiKey,
      hasPhoneNumberId: !!this.phoneNumberId,
      hasBusinessAccountId: !!this.businessAccountId
    });
  }

  // Format phone number for WhatsApp (international format without +)
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits and special characters
    const cleaned = phone.replace(/[^\d]/g, '');
    
    // If already starts with 91 (India), use as is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return cleaned;
    }
    
    // If starts with 0, replace with 91
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      return '91' + cleaned.substring(1);
    }
    
    // If 10 digits, add 91 prefix (India)
    if (cleaned.length === 10) {
      return '91' + cleaned;
    }
    
    // If 11 digits starting with 1, assume it's already country code
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return cleaned;
    }
    
    // For other lengths, assume it needs 91 prefix
    return cleaned.startsWith('91') ? cleaned : '91' + cleaned;
  }

  // Generate order confirmation message template
  private generateConfirmationMessage(order: OrderConfirmation, language: 'en' | 'ta' = 'en'): string {
    const orderIdShort = order.orderId.slice(-8).toUpperCase();
    
    if (language === 'ta') {
      return `🙏 வணக்கம் ${order.customerName}!

*AskMatsya ஆர்டர் உறுதிப்படுத்தல்* ✅

📦 *ஆர்டர் விவரங்கள்:*
🆔 ஆர்டர் ID: #AM${orderIdShort}
🛍️ பொருள்: ${order.productName}
💰 விலை: ${order.price}
${order.artisan ? `👨‍🎨 கைவினைஞர்: ${order.artisan}\n` : ''}📅 எதிர்பார்க்கப்படும் டெலிவரி: ${order.estimatedDelivery}

*அடுத்த படிகள்:*
✅ உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது
📞 24 மணி நேரத்திற்குள் எங்கள் குழு உங்களை அழைக்கும்
💳 கட்டண விருப்பங்கள்: UPI, கார்டு, அல்லது COD
🚚 பொருள் கிடைக்கும் தன்மையை உறுதிப்படுத்துவோம்

❓ *கேள்விகளா?* இந்த எண்ணுக்கு பதிலளிக்கவும்!

🎨 *உண்மையான இந்திய கைவினைப் பொருட்கள்*
நன்றி - AskMatsya குழு 🛍️✨`;
    }

    return `🙏 Namaste ${order.customerName}!

*AskMatsya Order Confirmation* ✅

📦 *Order Details:*
🆔 Order ID: #AM${orderIdShort}
🛍️ Product: ${order.productName}
💰 Price: ${order.price}
${order.artisan ? `👨‍🎨 Artisan: ${order.artisan}\n` : ''}📅 Expected Delivery: ${order.estimatedDelivery}

*Next Steps:*
✅ Your order has been successfully registered
📞 Our team will call you within 24 hours
💳 Payment options: UPI, Card, or Cash on Delivery
🚚 We'll confirm product availability & delivery

❓ *Questions?* Simply reply to this message!

🎨 *Authentic Indian Handcrafts*
Thank you - Team AskMatsya 🛍️✨`;
  }

  // Generate admin notification message
  private generateAdminNotification(order: OrderConfirmation): string {
    const orderIdShort = order.orderId.slice(-8).toUpperCase();
    
    return `🚨 *NEW ORDER ALERT* 🚨

📦 Order #AM${orderIdShort}
👤 Customer: ${order.customerName}
📱 Phone: ${order.customerPhone}
🛍️ Product: ${order.productName}
💰 Price: ${order.price}
${order.artisan ? `👨‍🎨 Artisan: ${order.artisan}\n` : ''}
⏰ Ordered: ${new Date().toLocaleString('en-IN')}

*ACTION REQUIRED:*
1. Contact customer within 24 hours
2. Confirm product availability
3. Discuss final pricing & delivery
4. Update order status in admin panel

🔗 Admin Panel: ${window.location.origin}/admin

*AskMatsya Order Management*`;
  }

  // Send message using WhatsApp Business API
  private async sendWhatsAppMessage(to: string, message: string, messageType: 'confirmation' | 'admin' = 'confirmation'): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(to);
    
    // If no API configuration, fall back to WhatsApp Web
    if (!this.apiKey || !this.phoneNumberId) {
      console.log('No WhatsApp API configuration, falling back to WhatsApp Web');
      return this.fallbackToWhatsAppWeb(formattedPhone, message);
    }

    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message
        }
      };

      console.log('Sending WhatsApp message:', { to: formattedPhone, messageType });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.messages && result.messages[0].id) {
        console.log('✅ WhatsApp message sent successfully:', result.messages[0].id);
        
        // Log successful delivery
        await this.logWhatsAppDelivery(formattedPhone, message, 'delivered', result.messages[0].id);
        
        return true;
      } else {
        console.error('WhatsApp API error:', result);
        
        // Log failed delivery
        await this.logWhatsAppDelivery(formattedPhone, message, 'failed', null, result.error?.message);
        
        // Fallback to WhatsApp Web
        return this.fallbackToWhatsAppWeb(formattedPhone, message);
      }

    } catch (error) {
      console.error('WhatsApp API request failed:', error);
      
      // Log failed delivery
      await this.logWhatsAppDelivery(formattedPhone, message, 'failed', null, error instanceof Error ? error.message : 'Unknown error');
      
      // Fallback to WhatsApp Web
      return this.fallbackToWhatsAppWeb(formattedPhone, message);
    }
  }

  // Fallback to WhatsApp Web when API fails
  private fallbackToWhatsAppWeb(phone: string, message: string): boolean {
    try {
      const whatsappWebUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      console.log('Opening WhatsApp Web as fallback');
      
      // Open in new tab
      window.open(whatsappWebUrl, '_blank', 'noopener,noreferrer');
      
      return true;
    } catch (error) {
      console.error('Failed to open WhatsApp Web:', error);
      return false;
    }
  }

  // Log WhatsApp message delivery status
  private async logWhatsAppDelivery(
    to: string, 
    message: string, 
    status: 'delivered' | 'failed', 
    messageId: string | null,
    errorMessage?: string
  ): Promise<void> {
    try {
      await supabase.from('user_interactions').insert({
        session_id: `whatsapp_${Date.now()}`,
        interaction_type: 'order_intent',
        query_text: `WhatsApp ${status}: ${to}`,
        response_data: {
          type: 'whatsapp_delivery',
          to,
          status,
          messageId,
          errorMessage,
          messageLength: message.length,
          timestamp: new Date().toISOString()
        },
        language: 'en',
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to log WhatsApp delivery:', error);
    }
  }

  // Main method to send order confirmation
  async sendOrderConfirmation(order: OrderConfirmation, language: 'en' | 'ta' = 'en'): Promise<boolean> {
    const message = this.generateConfirmationMessage(order, language);
    
    console.log('Sending order confirmation to:', order.customerPhone);
    
    try {
      const success = await this.sendWhatsAppMessage(order.customerPhone, message, 'confirmation');
      
      if (success) {
        console.log('✅ Order confirmation sent successfully');
        
        // Update order status to indicate WhatsApp sent
        await this.updateOrderWhatsAppStatus(order.orderId, true);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
      await this.updateOrderWhatsAppStatus(order.orderId, false);
      return false;
    }
  }

  // Send admin notification about new order
  async notifyAdminNewOrder(order: OrderConfirmation): Promise<boolean> {
    const adminMessage = this.generateAdminNotification(order);
    
    console.log('Sending admin notification for order:', order.orderId);
    
    try {
      const success = await this.sendWhatsAppMessage(this.adminPhone, adminMessage, 'admin');
      
      if (success) {
        console.log('✅ Admin notification sent successfully');
      }
      
      return success;
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      return false;
    }
  }

  // Update order record with WhatsApp delivery status
  private async updateOrderWhatsAppStatus(orderId: string, whatsappSent: boolean): Promise<void> {
    try {
      await supabase
        .from('orders')
        .update({ 
          order_notes: whatsappSent 
            ? 'WhatsApp confirmation sent successfully' 
            : 'WhatsApp confirmation failed - fallback used',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
    } catch (error) {
      console.error('Failed to update order WhatsApp status:', error);
    }
  }

  // Test WhatsApp connectivity
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.apiKey || !this.phoneNumberId) {
      return {
        success: false,
        message: 'WhatsApp API not configured. Using WhatsApp Web fallback.'
      };
    }

    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: 'WhatsApp Business API connected successfully!'
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: `WhatsApp API error: ${error.error?.message || 'Unknown error'}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Send order status update to customer
  async sendOrderStatusUpdate(
    customerPhone: string, 
    orderId: string, 
    newStatus: string, 
    language: 'en' | 'ta' = 'en'
  ): Promise<boolean> {
    const orderIdShort = orderId.slice(-8).toUpperCase();
    
    const statusMessages = {
      en: {
        confirmed: `✅ Great news! Your order #AM${orderIdShort} has been confirmed by our artisan. We'll start crafting your beautiful piece soon!`,
        processing: `🎨 Your order #AM${orderIdShort} is now being crafted with love and traditional techniques. We'll update you on progress!`,
        shipped: `🚚 Exciting! Your order #AM${orderIdShort} has been shipped. Your authentic handcraft is on its way to you!`,
        delivered: `🎉 Wonderful! Your order #AM${orderIdShort} has been delivered. We hope you love your authentic Indian handcraft! Please share your feedback.`
      },
      ta: {
        confirmed: `✅ நல்ல செய்தி! உங்கள் ஆர்டர் #AM${orderIdShort} எங்கள் கைவினைஞரால் உறுதிப்படுத்தப்பட்டுள்ளது. விரைவில் உங்கள் அழகான பொருளை உருவாக்க ஆரம்பிப்போம்!`,
        processing: `🎨 உங்கள் ஆர்டர் #AM${orderIdShort} இப்போது அன்பு மற்றும் பாரம்பரிய நுட்பங்களுடன் உருவாக்கப்படுகிறது. முன்னேற்றத்தை உங்களுக்கு தெரிவிப்போம்!`,
        shipped: `🚚 உற்சாகம்! உங்கள் ஆர்டர் #AM${orderIdShort} அனுப்பப்பட்டுள்ளது. உங்கள் உண்மையான கைவினைப் பொருள் உங்களை நோக்கி வருகிறது!`,
        delivered: `🎉 அருமை! உங்கள் ஆர்டர் #AM${orderIdShort} டெலிவர் செய்யப்பட்டுள்ளது. உங்கள் உண்மையான இந்திய கைவினைப் பொருளை நீங்கள் விரும்புவீர்கள் என்று நம்புகிறோம்! உங்கள் கருத்தைப் பகிரவும்.`
      }
    };

    const message = statusMessages[language][newStatus] || 
      `📦 Your order #AM${orderIdShort} status has been updated to: ${newStatus}`;

    return await this.sendWhatsAppMessage(customerPhone, message);
  }
}

export const whatsappService = new WhatsAppService();

// Helper function to calculate estimated delivery based on craft time
export function calculateEstimatedDelivery(craftTime?: string): string {
  const now = new Date();
  let deliveryDays = 7; // Default 1 week

  if (craftTime) {
    const timeStr = craftTime.toLowerCase();
    
    // Parse different craft time formats
    if (timeStr.includes('60') || timeStr.includes('45-60')) {
      deliveryDays = 75; // ~10-11 weeks
    } else if (timeStr.includes('45') || timeStr.includes('30-45')) {
      deliveryDays = 60; // ~8-9 weeks
    } else if (timeStr.includes('30')) {
      deliveryDays = 45; // ~6-7 weeks
    } else if (timeStr.includes('25') || timeStr.includes('20-35')) {
      deliveryDays = 35; // ~5 weeks
    } else if (timeStr.includes('20')) {
      deliveryDays = 30; // ~4-5 weeks
    } else if (timeStr.includes('15')) {
      deliveryDays = 25; // ~3-4 weeks
    } else if (timeStr.includes('10')) {
      deliveryDays = 20; // ~3 weeks
    } else if (timeStr.includes('7') || timeStr.includes('5-10')) {
      deliveryDays = 14; // ~2 weeks
    } else if (timeStr.includes('fresh')) {
      deliveryDays = 5; // For fresh spices/food items
    }
  }

  const deliveryDate = new Date(now.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
  
  return deliveryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}