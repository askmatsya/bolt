import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2, Globe } from 'lucide-react';
import { VoiceState } from '../types';

interface VoiceInterfaceProps {
  voiceState: VoiceState;
  onVoiceToggle: () => void;
  onVoiceInput: (input: string) => void;
  language: 'en' | 'ta';
  onLanguageChange: (lang: 'en' | 'ta') => void;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  voiceState,
  onVoiceToggle,
  onVoiceInput,
  language,
  onLanguageChange
}) => {
  const [waveAnimation, setWaveAnimation] = useState(false);

  useEffect(() => {
    if (voiceState.isListening || voiceState.isSpeaking) {
      setWaveAnimation(true);
    } else {
      setWaveAnimation(false);
    }
  }, [voiceState.isListening, voiceState.isSpeaking]);

  const handleQuickInput = (input: string) => {
    onVoiceInput(input);
  };

  const toggleLanguage = () => {
    onLanguageChange(language === 'en' ? 'ta' : 'en');
  };

  const getText = (key: string) => {
    const texts = {
      en: {
        greeting: 'Namaste! I am Matsya',
        subtitle: 'Your AI guide for authentic Indian ethnic products',
        listening: 'I am listening...',
        listeningSubtitle: 'Listening for your request...',
        chooseOptions: 'Or choose from the options below:',
        weddingSaree: 'Wedding Saree',
        weddingSareeTamil: 'For weddings',
        traditionalJewelry: 'Traditional Jewelry',
        traditionalJewelryTamil: 'Traditional ornaments',
        culturalStories: 'Cultural Stories',
        culturalStoriesTamil: 'Cultural tales',
        giftIdeas: 'Gift Ideas',
        giftIdeasTamil: 'Gift suggestions',
        quickOptions: [
          "I need a saree for my wedding",
          "Show me traditional jewelry under 10000",
          "I want to learn about Madhubani art",
          "Suggest a gift under 5000 rupees"
        ]
      },
      ta: {
        greeting: 'வணக்கம்! நான் மத்ஸ்யா',
        subtitle: 'உண்மையான இந்திய பாரம்பரிய பொருட்களுக்கான உங்கள் AI வழிகாட்டி',
        listening: 'நான் கேட்டுக்கொண்டிருக்கிறேன்...',
        listeningSubtitle: 'உங்கள் கோரிக்கையை கேட்டுக்கொண்டிருக்கிறேன்...',
        chooseOptions: 'அல்லது கீழே உள்ள விருப்பங்களில் இருந்து தேர்வு செய்யுங்கள்:',
        weddingSaree: 'திருமண புடவை',
        weddingSareeTamil: 'திருமணத்திற்கு',
        traditionalJewelry: 'பாரம்பரிய நகைகள்',
        traditionalJewelryTamil: 'பாரம்பரிய அணிகலன்கள்',
        culturalStories: 'கலாச்சார கதைகள்',
        culturalStoriesTamil: 'கலாச்சார கதைகள்',
        giftIdeas: 'பரிசு யோசனைகள்',
        giftIdeasTamil: 'பரிசு பரிந்துரைகள்',
        quickOptions: [
          "எனக்கு திருமணத்திற்கு ஒரு புடவை வேண்டும்",
          "10000க்கு கீழ் பாரம்பரிய நகைகளை காட்டுங்கள்",
          "மதுபனி கலையைப் பற்றி தெரிந்துகொள்ள விரும்புகிறேன்",
          "5000 ரூபாய்க்கு கீழ் ஒரு பரிசை பரிந்துரைக்கவும்"
        ]
      }
    };
    return texts[language][key] || texts.en[key];
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200 shadow-lg">
      <div className="text-center">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 bg-white hover:bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
          >
            <Globe className="w-4 h-4 text-orange-600" />
            <span className="text-orange-700">{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="relative inline-block">
            <button
              onClick={onVoiceToggle}
              className={`
                relative w-24 h-24 rounded-full transition-all duration-300 shadow-xl
                ${voiceState.isListening 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-200' 
                  : 'bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-200'
                }
                ${waveAnimation ? 'animate-pulse' : ''}
              `}
            >
              {voiceState.isProcessing ? (
                <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
              ) : voiceState.isListening ? (
                <MicOff className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : (
                <Mic className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
            
            {/* Voice waves animation */}
            {waveAnimation && (
              <div className="absolute inset-0 -m-2">
                <div className="w-28 h-28 border-2 border-orange-300 rounded-full animate-ping opacity-30"></div>
                <div className="absolute inset-0 w-28 h-28 border-2 border-orange-400 rounded-full animate-ping opacity-20 animation-delay-150"></div>
                <div className="absolute inset-0 w-28 h-28 border-2 border-orange-500 rounded-full animate-ping opacity-10 animation-delay-300"></div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {voiceState.isListening ? getText('listening') : getText('greeting')}
          </h3>
          <p className="text-gray-600">
            {voiceState.isListening ? getText('listeningSubtitle') : getText('subtitle')}
          </p>
        </div>

        {voiceState.isSpeaking && (
          <div className="flex items-center justify-center mb-4">
            <Volume2 className="w-5 h-5 text-orange-600 mr-2" />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce animation-delay-200"></div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-gray-600 mb-4">{getText('chooseOptions')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickInput(getText('quickOptions')[0])}
              className="bg-white hover:bg-orange-50 border border-orange-200 rounded-lg p-3 text-left transition-colors duration-200"
            >
              <span className="text-sm font-medium text-gray-800">{getText('weddingSaree')}</span>
              <p className="text-xs text-gray-600 mt-1">{getText('weddingSareeTamil')}</p>
            </button>
            <button
              onClick={() => handleQuickInput(getText('quickOptions')[1])}
              className="bg-white hover:bg-orange-50 border border-orange-200 rounded-lg p-3 text-left transition-colors duration-200"
            >
              <span className="text-sm font-medium text-gray-800">{getText('traditionalJewelry')}</span>
              <p className="text-xs text-gray-600 mt-1">{getText('traditionalJewelryTamil')}</p>
            </button>
            <button
              onClick={() => handleQuickInput(getText('quickOptions')[2])}
              className="bg-white hover:bg-orange-50 border border-orange-200 rounded-lg p-3 text-left transition-colors duration-200"
            >
              <span className="text-sm font-medium text-gray-800">{getText('culturalStories')}</span>
              <p className="text-xs text-gray-600 mt-1">{getText('culturalStoriesTamil')}</p>
            </button>
            <button
              onClick={() => handleQuickInput(getText('quickOptions')[3])}
              className="bg-white hover:bg-orange-50 border border-orange-200 rounded-lg p-3 text-left transition-colors duration-200"
            >
              <span className="text-sm font-medium text-gray-800">{getText('giftIdeas')}</span>
              <p className="text-xs text-gray-600 mt-1">{getText('giftIdeasTamil')}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};