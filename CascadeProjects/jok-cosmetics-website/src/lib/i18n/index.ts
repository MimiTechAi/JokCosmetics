import { createTranslator } from 'next-intl';

const translations = {
  de: {
    home: {
      hero: {
        title: 'Entdecke deine wahre Schönheit',
        subtitle: 'Willkommen bei Jok Cosmetics in Bad Liebenzell',
        cta: 'Jetzt Termin buchen'
      },
      services: {
        title: 'Unsere Dienstleistungen'
      }
    },
    common: {
      bookNow: 'Termin buchen'
    }
  },
  en: {
    home: {
      hero: {
        title: 'Discover Your True Beauty',
        subtitle: 'Welcome to Jok Cosmetics in Bad Liebenzell',
        cta: 'Book Now'
      },
      services: {
        title: 'Our Services'
      }
    },
    common: {
      bookNow: 'Book Now'
    }
  }
};

export async function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations.de;
}
