import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Globe, Heart, Award } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';
import { VoiceInterface } from './components/VoiceInterface';
import { ConversationHistory } from './components/ConversationHistory';
import { ProductModal } from './components/ProductModal';
import { OrderModal } from './components/OrderModal';
import { VoiceState, Conversation, Product } from './types';
import { AIMatsya } from './utils/ai';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { generateSessionId } from './services/database';

function App() {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    volume: 0
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [sessionId] = useState(() => generateSessionId());
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [ai] = useState(() => new AIMatsya());
  const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech();

  // Function to refresh AI product cache
  const refreshVoiceSearchCache = useCallback(async () => {
    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setConnectionError('Supabase not configured. Using sample data for demo.');
      }
      
      await ai.refreshProducts();
      console.log('Voice search cache refreshed with latest products');
    } catch (error) {
      console.error('Failed to refresh voice search cache:', error);
      setConnectionError('Failed to load products. Using sample data for demo.');
    }
  }, [ai]);
  // Update voice state based on TTS
  useEffect(() => {
    setVoiceState(prev => ({ ...prev, isSpeaking }));
  }, [isSpeaking]);

  // Welcome message
  useEffect(() => {
    const welcomeMessage: Conversation = {
      id: '1',
      message: language === 'ta' 
        ? `வணக்கம்! 🙏 AskMatsya-வில் உங்களை வரவேற்கிறோம்! உண்மையான இந்திய பாரம்பரிய பொருட்களுக்கான உங்கள் AI வழிகாட்டி நான்.

நான் உங்களுக்கு உதவ முடியும்:
• பாரம்பரிய புடவைகள், நகைகள் மற்றும் கைவினைப் பொருட்களைக் கண்டறிய
• கலாச்சார முக்கியத்துவம் மற்றும் கதைகளைப் பற்றி அறிய
• எந்த நிகழ்விற்கும் சரியான பரிசுகளைக் கண்டறிய
• உண்மையான கைவினைஞர்களுடன் இணைக்க
• நம்பகமான விற்பனையாளர்களுடன் ஆர்டர் செய்ய

நீங்கள் ஏதாவது குறிப்பிட்ட பொருளைத் தேடுகிறீர்களா?`
        : `Namaste! 🙏 Welcome to AskMatsya! I'm your AI guide for authentic Indian ethnic products. 

I can help you:
• Discover traditional sarees, jewelry, and handicrafts
• Learn about cultural significance and stories
• Find perfect gifts for any occasion
• Connect with authentic artisans
• Place orders with trusted sellers

What specific item are you looking for?`,
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    };
    setConversations([welcomeMessage]);

    // Refresh AI cache on app load to get latest products
    refreshVoiceSearchCache();
  }, [language, refreshVoiceSearchCache]);

  const handleVoiceToggle = async () => {
    // This is now handled by the VoiceInterface component
    // Keep this for backward compatibility
  };

  const handleVoiceInput = async (input: string) => {
    if (!input.trim()) return;

    // Stop any current speech
    stopSpeaking();

    // Refresh AI product data before processing (ensures latest products are available)
    await ai.refreshProducts();
    
    // Add user message
    const userMessage: Conversation = {
      id: Date.now().toString(),
      message: input,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setConversations(prev => [...prev, userMessage]);
    setVoiceState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Set AI language
      ai.setLanguage(language);
      
      // Simulate AI processing
      await ai.simulateVoiceProcessing();
      
      const aiResponse = ai.processVoiceInput(input);
      
      setVoiceState(prev => ({ ...prev, isProcessing: false }));

      // Add AI response
      const aiMessage: Conversation = {
        id: (Date.now() + 1).toString(),
        message: aiResponse.response,
        isUser: false,
        timestamp: new Date(),
        products: aiResponse.products,
        type: aiResponse.type
      };

      setConversations(prev => [...prev, aiMessage]);

      // Speak the response
      setTimeout(() => {
        speak(aiResponse.response, language);
      }, 500);

    } catch (error) {
      setVoiceState(prev => ({ ...prev, isProcessing: false }));
      console.error('Voice processing error:', error);
      
      const errorMessage: Conversation = {
        id: (Date.now() + 2).toString(),
        message: language === 'ta' 
          ? 'மன்னிக்கவும், ஏதோ தவறு நடந்துள்ளது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.'
          : 'Sorry, something went wrong. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      
      setConversations(prev => [...prev, errorMessage]);
    }
  };

  const handleLearnMore = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOrder = (product: Product) => {
    setOrderProduct(product);
    setIsOrderModalOpen(true);
  };

  const getHeaderText = () => {
    return {
      title: 'AskMatsya',
      subtitle: language === 'ta' 
        ? 'பாரம்பரிய பொருட்களுக்கான AI வழிகாட்டி'
        : 'AI Guide for Ethnic Products',
      stats: language === 'ta' ? {
        artisans: 'இணைக்கப்பட்ட கைவினைஞர்கள்',
        customers: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',
        stories: 'கலாச்சார கதைகள்',
        regions: 'மாநிலங்கள் உள்ளடக்கம்'
      } : {
        artisans: 'Artisans Connected',
        customers: 'Happy Customers', 
        stories: 'Cultural Stories',
        regions: 'Regions Covered'
      }
    };
  };

  const headerText = getHeaderText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  {headerText.title}
                </h1>
                <p className="text-sm text-gray-600">{headerText.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1 text-orange-500" />
                  <span>{language === 'ta' ? 'இந்தியா முழுவதும்' : 'India-wide'}</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1 text-orange-500" />
                  <span>{language === 'ta' ? 'உண்மையான' : 'Authentic'}</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-orange-500" />
                  <span>{language === 'ta' ? 'கைவினை' : 'Handcrafted'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status Banner */}
        {connectionError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-amber-600" />
              <p className="text-amber-800 text-sm">
                <strong>Demo Mode:</strong> {connectionError} 
                <a href="/SETUP_INSTRUCTIONS.md" className="text-amber-600 underline ml-1">
                  View setup instructions
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Quick Admin Access for Testing */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                {language === 'ta' ? 'டெவலப்பர் அணுகல்' : 'Developer Access'}
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                {language === 'ta' 
                  ? 'ஆர்டர்களையும் இன்வென்டரியையும் நிர்வகிக்க அட்மின் பேனலை அணுகவும்'
                  : 'Access admin panel to manage orders and inventory'
                }
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={refreshVoiceSearchCache}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                title="Refresh voice search with latest products"
              >
                🔄 Sync Voice
              </button>
              <a
                href="/admin"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {language === 'ta' ? 'அட்மின் பேனல்' : 'Admin Panel'}
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Voice Interface */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <VoiceInterface
                voiceState={voiceState}
                onVoiceToggle={handleVoiceToggle}
                onVoiceInput={handleVoiceInput}
                language={language}
                onLanguageChange={setLanguage}
              />
              
              {/* Quick Stats */}
              <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">
                  {language === 'ta' ? 'AskMatsya தாக்கம்' : 'AskMatsya Impact'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{headerText.stats.artisans}</span>
                    <span className="font-semibold text-orange-600">1,200+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{headerText.stats.customers}</span>
                    <span className="font-semibold text-orange-600">15,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{headerText.stats.stories}</span>
                    <span className="font-semibold text-orange-600">500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{headerText.stats.regions}</span>
                    <span className="font-semibold text-orange-600">28 {language === 'ta' ? 'மாநிலங்கள்' : 'States'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conversation Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {language === 'ta' ? 'மத்ஸ்யாவுடன் உரையாடல்' : 'Conversation with Matsya'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{language === 'ta' ? 'AI உதவியாளர் செயலில்' : 'AI Assistant Active'}</span>
                </div>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-100">
                <ConversationHistory
                  conversations={conversations}
                  onLearnMore={handleLearnMore}
                  onOrder={handleOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <span className="text-lg font-semibold text-gray-800">AskMatsya</span>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'ta' 
                ? 'உண்மையான இந்திய பாரம்பரிய பொருட்களையும் அவற்றின் பின்னணி கதைகளையும் உங்களுடன் இணைக்கிறது'
                : 'Connecting you with authentic Indian ethnic products and the stories behind them'
              }
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>🔒 {language === 'ta' ? 'பாதுகாப்பான பரிவர்த்தனைகள்' : 'Secure Transactions'}</span>
              <span>🚚 {language === 'ta' ? 'இந்தியா முழுவதும் டெலிவரி' : 'India-wide Delivery'}</span>
              <span>💎 {language === 'ta' ? 'உண்மைத்தன்மை உத்தரவாதம்' : 'Authenticity Guaranteed'}</span>
              <span>🎨 {language === 'ta' ? 'உள்ளூர் கைவினைஞர்களை ஆதரிக்கிறது' : 'Supporting Local Artisans'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onOrder={handleOrder}
      />

      <OrderModal
        product={orderProduct}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        language={language}
      />
    </div>
  );
}

export default App;