import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechHook {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string, language?: 'en' | 'ta') => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  currentVoice: string | null;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<string | null>(null);

  // Check if speech synthesis is supported
  const isSupported = typeof window !== 'undefined' && 
    'speechSynthesis' in window && 
    window.location.protocol === 'https:';

  // Load and update voices when they become available
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Initial load
    updateVoices();

    // Listen for voice changes (voices load asynchronously)
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

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

  // Advanced voice selection for natural, human-like speech
  const selectBestVoice = useCallback((language: 'en' | 'ta') => {
    if (voices.length === 0) return null;

    const targetLang = language === 'ta' ? 'ta' : 'en';
    const targetRegion = language === 'ta' ? 'IN' : 'IN'; // Prefer Indian voices for both

    // Voice quality ranking (higher is better)
    const getVoiceQuality = (voice: SpeechSynthesisVoice): number => {
      let score = 0;
      
      // Prefer neural/natural voices (Google, Microsoft, Apple neural voices)
      if (voice.name.toLowerCase().includes('neural') || 
          voice.name.toLowerCase().includes('natural') ||
          voice.name.toLowerCase().includes('wavenet') ||
          voice.name.toLowerCase().includes('journey') ||
          voice.name.toLowerCase().includes('studio')) {
        score += 100;
      }

      // Prefer premium voices
      if (voice.name.toLowerCase().includes('premium') ||
          voice.name.toLowerCase().includes('enhanced') ||
          voice.name.toLowerCase().includes('high quality')) {
        score += 80;
      }

      // Prefer specific high-quality voice engines
      if (voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.name.includes('Amazon')) {
        score += 60;
      }

      // Prefer local/system voices over remote (better performance)
      if (voice.localService) {
        score += 40;
      }

      // Language and region matching
      if (voice.lang.startsWith(targetLang)) {
        score += 50;
        
        // Exact region match
        if (voice.lang.includes(targetRegion)) {
          score += 30;
        }
      }

      // For English, prefer specific regional variants
      if (language === 'en') {
        if (voice.lang === 'en-IN') score += 25; // Indian English
        else if (voice.lang === 'en-US') score += 20; // US English
        else if (voice.lang === 'en-GB') score += 15; // British English
        else if (voice.lang === 'en-AU') score += 10; // Australian English
      }

      // For Tamil, prioritize Tamil voices
      if (language === 'ta' && voice.lang.startsWith('ta')) {
        score += 50;
      }

      // Prefer female voices for more pleasant sound (studies show preference)
      if (voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('hazel') ||
          voice.name.toLowerCase().includes('aria')) {
        score += 10;
      }

      return score;
    };

    // Sort voices by quality score
    const sortedVoices = voices
      .map(voice => ({ voice, score: getVoiceQuality(voice) }))
      .sort((a, b) => b.score - a.score);

    const bestVoice = sortedVoices[0]?.voice;
    
    if (bestVoice) {
      setCurrentVoice(bestVoice.name);
    }

    return bestVoice;
  }, [voices]);

  const speak = useCallback((text: string, language: 'en' | 'ta' = 'en') => {
    if (!isSupported) {
      console.warn('Text-to-speech is not supported in this browser.');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Wait a bit to ensure cancellation is complete
    setTimeout(() => {
      const newUtterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced voice settings for natural speech
      newUtterance.rate = language === 'ta' ? 0.85 : 0.9; // Slightly slower for clarity
      newUtterance.pitch = 1.1; // Slightly higher pitch for friendliness
      newUtterance.volume = 0.85; // Slightly lower to avoid harshness
      
      // Set language with fallbacks
      const languageCodes = {
        ta: ['ta-IN', 'ta', 'hi-IN', 'en-IN'], // Tamil with fallbacks
        en: ['en-IN', 'en-US', 'en-GB', 'en-AU'] // Indian English preferred
      };
      
      newUtterance.lang = languageCodes[language][0];

      // Select the best available voice
      const bestVoice = selectBestVoice(language);
      if (bestVoice) {
        newUtterance.voice = bestVoice;
        console.log(`Using voice: ${bestVoice.name} (${bestVoice.lang})`);
      }

      // Add speech events for better control
      newUtterance.onstart = () => {
        setIsSpeaking(true);
      };

      newUtterance.onend = () => {
        setIsSpeaking(false);
      };

      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      // For longer texts, add natural pauses
      if (text.length > 100) {
        // Add slight pauses after sentences for more natural flow
        const enhancedText = text
          .replace(/\. /g, '. ') // Ensure space after periods
          .replace(/\! /g, '! ') // Ensure space after exclamations
          .replace(/\? /g, '? ') // Ensure space after questions
          .replace(/\, /g, ', '); // Ensure space after commas
        
        newUtterance.text = enhancedText;
      }

      setUtterance(newUtterance);
      
      // Use queueing for better reliability
      window.speechSynthesis.speak(newUtterance);
    }, 100);
  }, [isSupported, selectBestVoice]);

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
    resume,
    currentVoice
  };
};