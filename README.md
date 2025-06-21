# AskMatsya - AI Voice Bot for Ethnic Products

An AI-powered voice assistant that helps users discover authentic Indian ethnic products through natural voice interactions.

## 🌟 Features

- **Voice Recognition**: Real-time speech-to-text in English and Tamil
- **AI Product Discovery**: Intelligent product recommendations
- **Cultural Context**: Learn about traditional crafts and their significance
- **Order Management**: Simple ordering process with WhatsApp integration
- **Admin Portal**: Manage orders and inventory
- **Mobile-First Design**: Optimized for all devices
- **WhatsApp Integration**: Real-time order confirmations via WhatsApp
- **Multi-language Support**: English and Tamil support throughout

## 🚀 Quick Start

### For Users
1. Visit the main app at: https://askmatsya.us
2. Click the microphone button to start voice interaction
3. Ask about products like "Show me wedding sarees" or "Traditional jewelry under 5000"
4. Browse recommendations and place orders via WhatsApp

### For Admins
1. Access the admin panel at: https://askmatsya.us/admin
2. **No login required** - This is a demo environment
3. View and manage:
   - Dashboard with key metrics
   - Order management and status updates
   - Product inventory management
   - Analytics (coming soon)

## 🎯 Admin Panel Features

### Dashboard
- Order statistics and trends
- Product inventory overview
- Revenue tracking
- Recent activity feed

### Order Management
- View all customer orders
- Update order status (pending → confirmed → shipped → delivered)
- Contact customers via phone or WhatsApp
- Filter orders by status

### Inventory Management
- Add/edit products
- Toggle product visibility
- Manage categories and pricing
- Upload product images

## 🗣️ Voice Commands Examples

**English:**
- "Show me wedding sarees"  
- "Traditional jewelry under 200 dollars"
- "Tell me about Madhubani art"
- "Gift ideas for festivals"

**Tamil:**
- "எனக்கு திருமண புடவை காட்டுங்கள்"
- "பாரம்பரிய நகைகள் 200 டாலருக்கு கீழ்"
- "மதுபனி கலையைப் பற்றி சொல்லுங்கள்"

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Voice**: Web Speech API
- **Deployment**: Netlify
- **Icons**: Lucide React

## 📱 Mobile Experience

The entire application is mobile-first:
- Touch-friendly voice controls
- Responsive admin panels
- Optimized for thumb navigation
- Fast loading on mobile networks

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Design Philosophy

- **Cultural Authenticity**: Honors Indian design traditions
- **Accessibility**: Voice-first interface for all users
- **Simplicity**: Easy enough for novice admins
- **Performance**: Fast and lightweight

## 📊 Database Schema

The app uses a comprehensive database with:
- **Products**: Name, price (USD), cultural significance, materials
- **Categories**: Hierarchical product organization
- **Orders**: Customer details and order tracking
- **Artisans**: Craftsperson profiles and locations
- **Analytics**: User interaction tracking

## 🔐 Admin Access

**Current Setup**: No authentication required (demo mode)
**Production Setup**: Would implement proper admin authentication

## 🌍 Localization

- **English**: Full interface and voice support
- **Tamil**: Interface translation and voice recognition
- **Cultural Context**: Authentic terminology and explanations

## 📞 Support

For demo purposes, all orders are routed to a test WhatsApp number. In production, this would connect to actual artisan contacts.

## 🚀 Deployment

Deployed on Netlify with automatic builds from the main branch. The admin panel is accessible at `/admin` route.

## 🎯 Hackathon Submission

Built for Bolt.new hackathon with focus on:
- Voice-first user experience
- Cultural authenticity
- Simple admin interface
- Mobile-first design
- Real-world applicability

---

**Live Demo**: https://askmatsya.us
**Admin Panel**: https://askmatsya.us/admin
## 📱 WhatsApp Integration

### Order Confirmation Flow
1. Customer places order through voice or web interface
2. Order gets saved to database with pending status
3. WhatsApp confirmation sent to customer automatically
4. Admin receives WhatsApp notification about new order
5. Customer can track order status via WhatsApp

### WhatsApp Features
- **Automatic Confirmations**: Order details sent via WhatsApp
- **Admin Notifications**: Real-time alerts for new orders
- **Fallback Support**: If API fails, opens WhatsApp Web
- **Multi-language**: Supports English and Tamil messages
- **Order Tracking**: Customers can get updates via WhatsApp

### Configuration

To enable full WhatsApp API integration:

1. **Option 1: UltraMsg API (Recommended)**
   ```env
   VITE_WHATSAPP_API_KEY=your_ultramsg_token
   ```
   - Sign up at [UltraMsg](https://ultramsg.com/)
   - Get your API token
   - Add to environment variables

2. **Option 2: Twilio WhatsApp API**
   ```env
   VITE_WHATSAPP_API_KEY=your_twilio_auth_token
   ```
   - Set up Twilio WhatsApp sandbox
   - Configure webhook endpoints
   - Update API endpoints in `src/services/whatsapp.ts`

3. **Option 3: WhatsApp Business API**
   - Requires business verification
   - Contact WhatsApp for API access
   - Configure webhook endpoints

### Fallback Mode
If no API key is configured, the system automatically falls back to:
- WhatsApp Web links (wa.me)
- Opens WhatsApp app with pre-filled message
- Still provides great user experience
