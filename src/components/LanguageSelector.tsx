'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { SupportedLanguage } from '@/lib/i18n/types';

const languageNames: Record<SupportedLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  tr: 'Türkçe',
  ru: 'Русский'
} as const;

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{languageNames[language]}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <React.Fragment>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50"
            >
              {availableLanguages.map((lang) => (
                <motion.button
                  key={lang}
                  whileHover={{ x: 6 }}
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    language === lang
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors flex items-center justify-between`}
                >
                  <span>{languageNames[lang]}</span>
                  {language === lang && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-blue-600"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
