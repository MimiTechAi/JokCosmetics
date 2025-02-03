export interface ServiceFeature {
  icon: string;
  text: string;
}

export interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  image_url?: string;
  benefits?: string[];
  features?: {
    icon: string;
    text: string;
  }[];
  techniques?: string[];
  is_active: boolean;
  sort_order: number;
  slug: string;
  service_categories?: {
    name: string;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}
