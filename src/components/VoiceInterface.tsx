import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Globe, AlertCircle } from 'lucide-react';
import { VoiceState } from '../types';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

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
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);

  // Voice recognition hook
  const {
    isListening,
    isSupported: speechSupported,
    transcript,
    confidence,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition(language);

  // Text-to-speech hook
  const {
    isSpeaking,
    isSupported: ttsSupported,
    speak,
    stop: stopSpeaking
  } = useTextToSpeech();

  useEffect(() => {
    if (isListening || isSpeaking) {
      setWaveAnimation(true);
    } else {
      setWaveAnimation(false);
    }
  }, [isListening, isSpeaking]);

  // Handle transcript completion
  useEffect(() => {
    if (transcript && !isListening && confidence > 0.5) {
      onVoiceInput(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, confidence, onVoiceInput, resetTranscript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else if (isSpeaking) {
      stopSpeaking();
    } else {
      startListening();
    }
  };

  const handleQuickInput = (input: string) => {
    onVoiceInput(input);
    // Speak the response in the selected language
    if (ttsSupported) {
      setTimeout(() => {
        speak(input, language);
      }, 500);
    }
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
        listeningSubtitle: 'Speak now... I can understand English and Tamil',
        speaking: 'I am speaking...',
        speakingSubtitle: 'Playing response...',
        chooseOptions: 'Or choose from the options below:',
        weddingSaree: 'Wedding Saree',
        weddingSareeTamil: 'For weddings',
        traditionalJewelry: 'Traditional Jewelry',
        traditionalJewelryTamil: 'Traditional ornaments',
        culturalStories: 'Cultural Stories',
        culturalStoriesTamil: 'Cultural tales',
        giftIdeas: 'Gift Ideas',
        giftIdeasTamil: 'Gift suggestions',
        microphoneAccess: 'Microphone Access Required',
        enableMicrophone: 'Please allow microphone access to use voice features',
        notSupported: 'Voice features not supported in this browser',
        tryChrome: 'Try using Chrome or Edge for the best experience',
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
        listeningSubtitle: 'இப்போது பேசுங்கள்... நான் ஆங்கிலம் மற்றும் தமிழ் புரிந்துகொள்கிறேன்',
        speaking: 'நான் பேசுகிறேன்...',
        speakingSubtitle: 'பதிலை இயக்குகிறது...',
        chooseOptions: 'அல்லது கீழே உள்ள விருப்பங்களில் இருந்து தேர்வு செய்யுங்கள்:',
        weddingSaree: 'திருமண புடவை',
        weddingSareeTamil: 'திருமணத்திற்கு',
        traditionalJewelry: 'பாரம்பரிய நகைகள்',
        traditionalJewelryTamil: 'பாரம்பரிய அணிகலன்கள்',
        culturalStories: 'கலாச்சார கதைகள்',
        culturalStoriesTamil: 'கலாச்சார கதைகள்',
        giftIdeas: 'பரிசு யோசனைகள்',
        giftIdeasTamil: 'பரிசு பரிந்துரைகள்',
        microphoneAccess: 'மைக்ரோஃபோன் அணுகல் தேவை',
        enableMicrophone: 'குரல் அம்சங்களைப் பயன்படுத்த மைக்ரோஃபோன் அணுகலை அனுமதிக்கவும்',
        notSupported: 'இந்த உலாவியில் குரல் அம்சங்கள் ஆதரிக்கப்படவில்லை',
        tryChrome: 'சிறந்த அனுபவத்திற்கு Chrome அல்லது Edge ஐப் பயன்படுத்தவும்',
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

  const getStatusText = () => {
    if (speechError) return speechError;
    if (isListening) return getText('listening');
    if (isSpeaking) return getText('speaking');
    return getText('greeting');
  };

  const getSubtitleText = () => {
    if (speechError) {
      if (speechError.includes('permission') || speechError.includes('not-allowed')) {
        return getText('enableMicrophone');
      }
      return getText('tryChrome');
    }
    if (isListening) return getText('listeningSubtitle');
    if (isSpeaking) return getText('speakingSubtitle');
    return getText('subtitle');
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

        {/* Voice Button */}
        <div className="mb-6">
          <div className="relative inline-block">
            <button
              onClick={handleVoiceToggle}
              disabled={!speechSupported && !ttsSupported}
              className={`
                relative w-24 h-24 rounded-full transition-all duration-300 shadow-xl
                ${isListening 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-200' 
                  : isSpeaking
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200'
                  : 'bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-200'
                }
                ${waveAnimation ? 'animate-pulse' : ''}
                ${(!speechSupported && !ttsSupported) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {voiceState.isProcessing ? (
                <Loader2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
              ) : isListening ? (
                <MicOff className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              ) : isSpeaking ? (
                <VolumeX className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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

        {/* Status Text */}
        <div className="mb-4">
          <h3 className={`text-xl font-semibold mb-2 ${speechError ? 'text-red-600' : 'text-gray-800'}`}>
            {getStatusText()}
          </h3>
          <p className={`${speechError ? 'text-red-500' : 'text-gray-600'}`}>
            {getSubtitleText()}
          </p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">You said:</p>
            <p className="text-gray-800 font-medium">"{transcript}"</p>
            {confidence > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(confidence * 100)}%
              </p>
            )}
          </div>
        )}

        {/* Browser Support Warning */}
        {(!speechSupported || !ttsSupported) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                {window.location.protocol !== 'https:' 
                  ? 'Voice features require HTTPS. Please use the deployed site.'
                  : getText('notSupported')
                }
              </span>
            </div>
            <p className="text-xs text-yellow-700">
              {window.location.protocol !== 'https:' 
                ? 'Voice APIs only work on secure (HTTPS) connections.'
                : getText('tryChrome')
              }
            </p>
          </div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="flex items-center justify-center mb-4">
            <Volume2 className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600 mr-3">Speaking with natural voice</span>
            <div className="flex space-x-1">
              <div className="w-2 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-6 bg-blue-500 rounded-full animate-pulse animation-delay-100"></div>
              <div className="w-2 h-4 bg-blue-500 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-5 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
              <div className="w-2 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-100"></div>
            </div>
          </div>
        )}

        {/* Quick Options */}
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