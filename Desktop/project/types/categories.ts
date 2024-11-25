export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
  parentId?: string;
  certifications?: string[];
  filters?: string[];
  featured?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  filters: {
    certifications: string[];
    attributes: string[];
    sustainability: string[];
  };
}

export interface CategoryFilter {
  id: string;
  name: string;
  type: 'certification' | 'attribute' | 'sustainability';
  values: string[];
}

export const CERTIFICATIONS = {
  BIO: 'Bio',
  DEMETER: 'Demeter',
  FAIRTRADE: 'Fairtrade',
  GOTS: 'GOTS',
  NATURLAND: 'Naturland',
  ECOCERT: 'EcoCert',
  BDIH: 'BDIH',
  NATRUE: 'NaTrue',
  FSC: 'FSC',
  MSC: 'MSC',
} as const;

export const SUSTAINABILITY_ATTRIBUTES = {
  VEGAN: 'Vegan',
  ZERO_WASTE: 'Zero Waste',
  PLASTIC_FREE: 'Plastikfrei',
  REGIONAL: 'Regional',
  SEASONAL: 'Saisonal',
  SECOND_HAND: 'Second Hand',
  REFURBISHED: 'Refurbished',
  ORGANIC: 'Bio',
  FAIR_PRODUCTION: 'Faire Produktion',
  CLIMATE_NEUTRAL: 'Klimaneutral',
  BIODEGRADABLE: 'Biologisch abbaubar',
  RECYCLABLE: 'Recyclingfähig',
  RECYCLED: 'Recycelt',
  REUSABLE: 'Wiederverwendbar',
  COMPOSTABLE: 'Kompostierbar',
} as const;