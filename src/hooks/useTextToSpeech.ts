import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechHook {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, language?: 'en' | 'ta') => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Check if speech synthesis is supported
  const isSupported = typeof window !== 'undefined' && 
    'speechSynthesis' in window && 
    window.location.protocol === 'https:';

  useEffect(() => {
    if (!isSupported) return;

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };

    if (utterance) {
      utterance.addEventListener('end', handleSpeechEnd);
      utterance.addEventListener('start', handleSpeechStart);

      return () => {
        utterance.removeEventListener('end', handleSpeechEnd);
        utterance.removeEventListener('start', handleSpeechStart);
      };
    }
  }, [utterance, isSupported]);

  const speak = useCallback((text: string, language: 'en' | 'ta' = 'en') => {
    if (!isSupported) {
      console.warn('Text-to-speech is not supported in this browser.');
      return;
    }

    // Check if voices are loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Wait for voices to load
      window.speechSynthesis.onvoiceschanged = () => {
        speak(text, language);
      };
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    newUtterance.rate = 0.9; // Slightly slower for clarity
    newUtterance.pitch = 1;
    newUtterance.volume = 0.8;
    
    // Set language
    newUtterance.lang = language === 'ta' ? 'ta-IN' : 'en-IN';

    // Try to find a suitable voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(language === 'ta' ? 'ta' : 'en') && 
      voice.lang.includes('IN')
    ) || voices.find(voice => 
      voice.lang.startsWith(language === 'ta' ? 'ta' : 'en')
    );

    if (preferredVoice) {
      newUtterance.voice = preferredVoice;
    }

    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause();
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume();
    }
  }, [isSupported]);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    pause,
    resume
  };
};