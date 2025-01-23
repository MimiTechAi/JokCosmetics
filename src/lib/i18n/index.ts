export const defaultLocale = 'de';
export const locales = ['de', 'en'];

export const translations = {
  de: {
    navigation: {
      home: 'Home',
      services: 'Dienstleistungen',
      about: 'Über uns',
      gallery: 'Galerie',
      contact: 'Kontakt',
      booking: 'Termin buchen'
    },
    home: {
      hero: {
        title: 'Entdecke deine wahre Schönheit',
        subtitle: 'Professionelles Permanent Make-up & Wimpernverlängerung',
        cta: 'Termin buchen'
      },
      services: {
        title: 'Unsere Dienstleistungen',
        subtitle: 'Entdecken Sie unser Angebot'
      },
      about: {
        title: 'Über uns',
        content: 'Jok Cosmetics ist Ihr vertrauenswürdiger Partner für professionelles Permanent Make-up und Wimpernverlängerung in Bad Liebenzell.'
      },
      contact: {
        title: 'Kontakt',
        subtitle: 'Vereinbaren Sie einen Termin'
      }
    }
  },
  en: {
    navigation: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      gallery: 'Gallery',
      contact: 'Contact',
      booking: 'Book Now'
    },
    home: {
      hero: {
        title: 'Discover Your True Beauty',
        subtitle: 'Professional Permanent Make-up & Lash Extensions',
        cta: 'Book Now'
      },
      services: {
        title: 'Our Services',
        subtitle: 'Discover our offerings'
      },
      about: {
        title: 'About Us',
        content: 'Jok Cosmetics is your trusted partner for professional permanent make-up and lash extensions in Bad Liebenzell.'
      },
      contact: {
        title: 'Contact',
        subtitle: 'Schedule an appointment'
      }
    }
  }
} as const;

export async function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations.de;
}
