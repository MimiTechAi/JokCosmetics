'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, TranslationKey } from './types';
import { translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
  availableLanguages: SupportedLanguage[];
}

const defaultLanguage: SupportedLanguage = 'de';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(defaultLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferred-language') as SupportedLanguage;
      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      } else {
        const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
        const defaultLang = Object.keys(translations).includes(browserLang) ? browserLang : defaultLanguage;
        setLanguageState(defaultLang);
      }
    } catch (error) {
      console.error('Error loading language preferences:', error);
      setLanguageState(defaultLanguage);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    try {
      setLanguageState(lang);
      localStorage.setItem('preferred-language', lang);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, []);

  const t = useCallback((key: TranslationKey, params?: Record<string, string>): string => {
    try {
      let translation = translations[language]?.[key] || translations[defaultLanguage][key];
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          translation = translation.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
      }
      
      return translation;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  }, [language]);

  const availableLanguages: SupportedLanguage[] = Object.keys(translations) as SupportedLanguage[];

  const contextValue = React.useMemo(() => ({
    language,
    setLanguage,
    t,
    availableLanguages,
  }), [language, setLanguage, t]);

  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
