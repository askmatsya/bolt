# WhatsApp Business API Setup Guide

## Your Configuration Details

### Provided Credentials
- **Phone Number ID**: `618578974682253`
- **Business Account ID**: `1030404535901829`
- **API Access Token**: `EAA2ZBwPDJ5vQ...` (provided separately)

## Quick Setup Steps

### 1. Environment Variables
Add these to your `.env` file:

```env
VITE_WHATSAPP_API_KEY=EAA2ZBwPDJ5vQBO9OnKiaOzywBYB4v2lJZAtPRilknlVjM2fqBCq4uQQLTcaI4fRIrZAMT9jWbSLqDAcAqbDstbJSN8kyANO5PWZBRwAZCMGzsU0VETrDaTGWy6yz4e37p4Ge6ZBvRgdE2cysM9J7JmpKi8wDkECyhmYJs1A9VVKxALagZCWEHpMCvIuZAilgs7EPJ8GArvMdurki9ptoslP38wA1fzxbSvi7uSRF6hDM397j3SWZCnMmh9LEZD
VITE_WHATSAPP_PHONE_NUMBER_ID=618578974682253
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=1030404535901829
VITE_ADMIN_WHATSAPP=+919876543210
```

### 2. Verify Your Setup

1. **Test Connection in Admin Panel**
   - Go to `/admin`
   - Check the WhatsApp Integration Status
   - Should show "WhatsApp Business API connected successfully!"

2. **Test Order Flow**
   - Place a test order through the main app
   - Check if WhatsApp confirmation is sent automatically
   - Verify admin receives notification

### 3. Features Enabled

✅ **Order Confirmations**
- Automatic WhatsApp messages to customers
- Order ID, product details, delivery estimates
- Available in English and Tamil

✅ **Admin Notifications**
- Real-time alerts for new orders
- Customer contact information
- Direct links to admin panel

✅ **Status Updates**
- Send order progress updates to customers
- Status changes: confirmed → processing → shipped → delivered

✅ **Fallback Support**
- If API fails, opens WhatsApp Web automatically
- Ensures orders still work even with API issues

## Message Templates

### Order Confirmation (English)
```
🙏 Namaste [Customer Name]!

*AskMatsya Order Confirmation* ✅

📦 *Order Details:*
🆔 Order ID: #AM[ORDER_ID]
🛍️ Product: [Product Name]
💰 Price: [Price Range]
👨‍🎨 Artisan: [Artisan Name]
📅 Expected Delivery: [Date]

*Next Steps:*
✅ Your order has been successfully registered
📞 Our team will call you within 24 hours
💳 Payment options: UPI, Card, or Cash on Delivery
🚚 We'll confirm product availability & delivery

❓ *Questions?* Simply reply to this message!

🎨 *Authentic Indian Handcrafts*
Thank you - Team AskMatsya 🛍️✨
```

### Order Confirmation (Tamil)
```
🙏 வணக்கம் [Customer Name]!

*AskMatsya ஆர்டர் உறுதிப்படுத்தல்* ✅

📦 *ஆர்டர் விவரங்கள்:*
🆔 ஆர்டர் ID: #AM[ORDER_ID]
🛍️ பொருள்: [Product Name]
💰 விலை: [Price Range]
👨‍🎨 கைவினைஞர்: [Artisan Name]
📅 எதிர்பார்க்கப்படும் டெலிவரி: [Date]

*அடுத்த படிகள்:*
✅ உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது
📞 24 மணி நேரத்திற்குள் எங்கள் குழு உங்களை அழைக்கும்
💳 கட்டண விருப்பங்கள்: UPI, கார்டு, அல்லது COD
🚚 பொருள் கிடைக்கும் தன்மையை உறுதிப்படுத்துவோம்

❓ *கேள்விகளா?* இந்த எண்ணுக்கு பதிலளிக்கவும்!

🎨 *உண்மையான இந்திய கைவினைப் பொருட்கள்*
நன்றி - AskMatsya குழு 🛍️✨
```

## Technical Details

### API Endpoints Used
- **Send Message**: `https://graph.facebook.com/v18.0/618578974682253/messages`
- **Phone Number Info**: `https://graph.facebook.com/v18.0/618578974682253`

### Message Format
- **Type**: `text`
- **Messaging Product**: `whatsapp`
- **Phone Format**: International format without `+` (e.g., `919876543210`)

### Error Handling
- API failures automatically fall back to WhatsApp Web
- All delivery attempts are logged to database
- Success/failure status tracked per order

## Troubleshooting

### Common Issues

1. **"WhatsApp API not configured"**
   - Check environment variables are set correctly
   - Verify API token is not expired
   - Ensure phone number ID is correct

2. **Messages not sending**
   - Check phone number is verified in Meta Business Manager
   - Verify API token has messaging permissions
   - Check phone number format (international without +)

3. **Fallback to WhatsApp Web**
   - This is normal behavior when API fails
   - Customers can still complete orders
   - Consider it a backup, not a failure

### Testing Commands

```bash
# Test environment variables
echo $VITE_WHATSAPP_API_KEY
echo $VITE_WHATSAPP_PHONE_NUMBER_ID

# Check API connection (in browser console)
await whatsappService.testConnection()
```

## Next Steps

1. **Set Environment Variables**
   - Add to your `.env` file
   - Deploy to production with proper env vars

2. **Test Integration**
   - Place test orders
   - Verify messages are sent
   - Check admin notifications

3. **Customize Messages**
   - Update phone numbers and admin contacts
   - Modify message templates as needed
   - Add your brand-specific information

4. **Monitor Usage**
   - Check WhatsApp API usage in Meta Business Manager
   - Monitor delivery success rates
   - Set up alerts for API failures

Your WhatsApp Business API integration is now configured and ready to use! 🚀