export type SupportedLanguage = 'de' | 'en' | 'fr' | 'es' | 'tr' | 'ru';

export type TranslationKey = 
  | 'welcome'
  | 'input.placeholder'
  | 'button.send'
  | 'button.minimize'
  | 'button.maximize'
  | 'button.close'
  | 'loading'
  | 'error.general'
  | 'assistant.name'
  | 'assistant.greeting'
  | 'privacy.notice'
  | 'privacy.settings'
  | 'theme.light'
  | 'theme.dark'
  | 'theme.system';

export interface Translation {
  [key: string]: {
    [K in TranslationKey]: string;
  };
}
