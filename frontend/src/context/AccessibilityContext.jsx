import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [language, setLanguage] = useState('english'); // 'bengali', 'hindi', 'english'
  const [fontSize, setFontSize] = useState('normal'); // 'normal', 'large', 'xl'
  const [highContrast, setHighContrast] = useState(false);
  const [narrationVolume, setNarrationVolume] = useState(0.85);
  const [hapticIntensity, setHapticIntensity] = useState(1.0);
  const [audioNarrationEnabled, setAudioNarrationEnabled] = useState(true);
  const [isVibrationSupported, setIsVibrationSupported] = useState(false);

  useEffect(() => {
    // Check navigator.vibrate support
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      setIsVibrationSupported(true);
    }
  }, []);

  // Web Speech API Narrator helper
  const speakText = (text, lang = language) => {
    if (!audioNarrationEnabled || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior narration to avoid overlap
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = narrationVolume;
      utterance.rate = 0.95; // Slightly measured rate for cultural audio description clarity

      // Match language code
      if (lang === 'bengali') utterance.lang = 'bn-IN';
      else if (lang === 'hindi') utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Trigger device vibration pattern or fallback visual pulse
  const triggerHaptic = (pattern) => {
    if (!pattern) return;
    const scaledPattern = Array.isArray(pattern)
      ? pattern.map(p => Math.round(p * hapticIntensity))
      : [Math.round(pattern * hapticIntensity)];

    if (isVibrationSupported && navigator.vibrate) {
      try {
        navigator.vibrate(scaledPattern);
      } catch (e) {
        console.warn('Vibration API error:', e);
      }
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        setLanguage,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        narrationVolume,
        setNarrationVolume,
        hapticIntensity,
        setHapticIntensity,
        audioNarrationEnabled,
        setAudioNarrationEnabled,
        isVibrationSupported,
        speakText,
        triggerHaptic
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
