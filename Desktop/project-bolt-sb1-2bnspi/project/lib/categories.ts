import { Category, CategoryFilter, CERTIFICATIONS, SUSTAINABILITY_ATTRIBUTES } from '@/types/categories';

export const mainCategories: Category[] = [
  {
    id: 'food-drinks',
    name: 'Lebensmittel & Getränke',
    slug: 'lebensmittel-getraenke',
    description: 'Bio-Lebensmittel, Fairtrade-Produkte und nachhaltige Getränke',
    icon: 'Apple',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    filters: ['bio', 'fairtrade', 'regional', 'vegan', 'zero-waste'],
    featured: true
  },
  {
    id: 'fashion',
    name: 'Mode & Accessoires',
    slug: 'mode-accessoires',
    description: 'Nachhaltige Mode, GOTS-zertifizierte Kleidung und faire Accessoires',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f',
    filters: ['gots', 'fairtrade', 'vegan', 'second-hand'],
    featured: true
  },
  {
    id: 'beauty',
    name: 'Beauty & Kosmetik',
    slug: 'beauty-kosmetik',
    description: 'Naturkosmetik, Bio-Pflege und nachhaltige Beautyprodukte',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a',
    filters: ['bio', 'vegan', 'zero-waste'],
    featured: true
  },
  {
    id: 'household',
    name: 'Haushalt & Reinigung',
    slug: 'haushalt-reinigung',
    description: 'Ökologische Reinigungsmittel und nachhaltige Haushaltsprodukte',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6'
  },
  {
    id: 'garden',
    name: 'Garten & Outdoor',
    slug: 'garten-outdoor',
    description: 'Nachhaltige Gartenprodukte und umweltfreundliche Outdoor-Artikel',
    icon: 'Flower',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2'
  },
  {
    id: 'health',
    name: 'Gesundheit & Wellness',
    slug: 'gesundheit-wellness',
    description: 'Naturheilmittel und nachhaltige Wellnessprodukte',
    icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b'
  },
  {
    id: 'electronics',
    name: 'Elektronik & Technik',
    slug: 'elektronik-technik',
    description: 'Refurbished Geräte und energieeffiziente Elektronik',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
  },
  {
    id: 'kids',
    name: 'Kinder & Baby',
    slug: 'kinder-baby',
    description: 'Nachhaltige Kinderprodukte und Bio-Babyartikel',
    icon: 'Baby',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4'
  },
  {
    id: 'sports',
    name: 'Sport & Freizeit',
    slug: 'sport-freizeit',
    description: 'Nachhaltige Sportausrüstung und Freizeitprodukte',
    icon: 'Bike',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b'
  },
  {
    id: 'books',
    name: 'Bücher & Medien',
    slug: 'buecher-medien',
    description: 'Nachhaltigkeitsliteratur und digitale Medien',
    icon: 'Book',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'
  },
  {
    id: 'pets',
    name: 'Tierprodukte',
    slug: 'tierprodukte',
    description: 'Nachhaltige Produkte für Haustiere',
    icon: 'Paw',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7'
  },
  {
    id: 'office',
    name: 'Bürobedarf',
    slug: 'buerobedarf',
    description: 'Nachhaltiger Bürobedarf und Schreibwaren',
    icon: 'PenTool',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc'
  },
  {
    id: 'used',
    name: 'Gebrauchte Artikel',
    slug: 'gebrauchte-artikel',
    description: 'Second Hand und Refurbished Produkte',
    icon: 'RefreshCw',
    image: 'https://images.unsplash.com/photo-1562684850-5a28c5958d82'
  }
];

export const subCategories: Record<string, Category[]> = {
  'food-drinks': [
    {
      id: 'organic-food',
      name: 'Bio-Lebensmittel',
      slug: 'bio-lebensmittel',
      parentId: 'food-drinks',
      description: 'Trockenprodukte, Obst, Gemüse, Nüsse und Samen',
      certifications: [CERTIFICATIONS.BIO, CERTIFICATIONS.DEMETER, CERTIFICATIONS.NATURLAND]
    },
    {
      id: 'demeter',
      name: 'Demeter-Produkte',
      slug: 'demeter-produkte',
      parentId: 'food-drinks',
      description: 'Biodynamisch angebaute Lebensmittel',
      certifications: [CERTIFICATIONS.DEMETER]
    },
    {
      id: 'fairtrade-food',
      name: 'Fairtrade-Produkte',
      slug: 'fairtrade-produkte',
      parentId: 'food-drinks',
      description: 'Fair gehandelte Lebensmittel',
      certifications: [CERTIFICATIONS.FAIRTRADE]
    },
    {
      id: 'vegan-food',
      name: 'Vegane Produkte',
      slug: 'vegane-produkte',
      parentId: 'food-drinks',
      description: 'Pflanzliche Lebensmittel und Alternativen'
    },
    {
      id: 'regional',
      name: 'Regionale Produkte',
      slug: 'regionale-produkte',
      parentId: 'food-drinks',
      description: 'Lebensmittel aus der Region'
    }
  ],
  'fashion': [
    {
      id: 'gots-clothing',
      name: 'GOTS-zertifizierte Kleidung',
      slug: 'gots-kleidung',
      parentId: 'fashion',
      description: 'Bio-Textilien nach GOTS-Standard',
      certifications: [CERTIFICATIONS.GOTS]
    },
    {
      id: 'fairtrade-fashion',
      name: 'Fairtrade-Mode',
      slug: 'fairtrade-mode',
      parentId: 'fashion',
      description: 'Fair produzierte Kleidung',
      certifications: [CERTIFICATIONS.FAIRTRADE]
    },
    {
      id: 'second-hand-fashion',
      name: 'Second-Hand Mode',
      slug: 'second-hand-mode',
      parentId: 'fashion',
      description: 'Gebrauchte Kleidung in gutem Zustand'
    },
    {
      id: 'vegan-fashion',
      name: 'Vegane Mode',
      slug: 'vegane-mode',
      parentId: 'fashion',
      description: 'Mode ohne tierische Materialien'
    }
  ],
  'beauty': [
    {
      id: 'natural-cosmetics',
      name: 'Naturkosmetik',
      slug: 'naturkosmetik',
      parentId: 'beauty',
      description: 'Zertifizierte Naturkosmetik',
      certifications: [CERTIFICATIONS.NATRUE, CERTIFICATIONS.BDIH]
    },
    {
      id: 'organic-beauty',
      name: 'Bio-Kosmetik',
      slug: 'bio-kosmetik',
      parentId: 'beauty',
      description: 'Bio-zertifizierte Pflegeprodukte',
      certifications: [CERTIFICATIONS.BIO, CERTIFICATIONS.ECOCERT]
    },
    {
      id: 'zero-waste-beauty',
      name: 'Zero-Waste Beauty',
      slug: 'zero-waste-beauty',
      parentId: 'beauty',
      description: 'Verpackungsfreie Kosmetik'
    }
  ],
  'household': [
    {
      id: 'eco-cleaning',
      name: 'Öko-Reinigungsmittel',
      slug: 'oeko-reinigungsmittel',
      parentId: 'household',
      description: 'Umweltfreundliche Reinigungsprodukte'
    },
    {
      id: 'zero-waste-household',
      name: 'Zero-Waste Haushalt',
      slug: 'zero-waste-haushalt',
      parentId: 'household',
      description: 'Nachhaltige Haushaltsprodukte'
    },
    {
      id: 'energy-saving',
      name: 'Energiesparende Produkte',
      slug: 'energiesparende-produkte',
      parentId: 'household',
      description: 'Energieeffiziente Haushaltshelfer'
    }
  ]
  // Weitere Unterkategorien für die anderen Hauptkategorien...
};

export const categoryFilters: CategoryFilter[] = [
  {
    id: 'certifications',
    name: 'Zertifizierungen',
    type: 'certification',
    values: Object.values(CERTIFICATIONS)
  },
  {
    id: 'sustainability',
    name: 'Nachhaltigkeit',
    type: 'sustainability',
    values: Object.values(SUSTAINABILITY_ATTRIBUTES)
  },
  {
    id: 'condition',
    name: 'Zustand',
    type: 'attribute',
    values: ['Neu', 'Gebraucht', 'Refurbished']
  }
];