export type BrandId = 'gladchemistry' | 'felis-be-glad' | 'bubbles-detergents';

export interface BrandInfo {
  id: BrandId;
  name: string;
  tagline: string;
  category: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  bgTint: string;
  borderTint: string;
  badgeClass: string;
  buttonClass: string;
  heroImage: string;
  highlights: string[];
}

export const BRANDS: Record<BrandId, BrandInfo> = {
  gladchemistry: {
    id: 'gladchemistry',
    name: 'Gladchemistry',
    tagline: 'Organic Personal Care',
    category: 'Personal Care & Bath',
    description:
      'Pure, botanical-rich personal care formulated with organic extracts, mineral-rich bath fizzies, gentle foam baths, and skin-loving hygiene essentials.',
    primaryColor: '#16A34A',
    secondaryColor: '#2D3E2D',
    bgTint: 'bg-emerald-50/80',
    borderTint: 'border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
    heroImage: '/images/hero-organic.png',
    highlights: [
      '100% Organic Botanical Extracts',
      'Mineral Bath Fizzies & Foam Bath',
      'Gentle on Sensitive Skin',
    ],
  },
  'felis-be-glad': {
    id: 'felis-be-glad',
    name: 'Felis be Glad',
    tagline: 'Fine Fragrances & Diffusers',
    category: 'Fragrance, Home & Auto',
    description:
      'Inspired-by fine fragrances crafted for lasting sillage, paired with artisanal reed diffusers and luxury car perfumes that transform every space.',
    primaryColor: '#D97706',
    secondaryColor: '#1C1917',
    bgTint: 'bg-amber-50/80',
    borderTint: 'border-amber-200',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
    heroImage: '/images/hero-fragrance.png',
    highlights: [
      'Inspired-By Designer Scents',
      'Long-Lasting Reed Diffusers',
      'Signature Car Perfumes',
    ],
  },
  'bubbles-detergents': {
    id: 'bubbles-detergents',
    name: 'Bubbles Detergents',
    tagline: 'Home Care & Car Detergents',
    category: 'Home & Auto Cleaning',
    description:
      'Industrial-strength yet home-safe cleaning power. From thick bleach and pine gel to high-gloss car wash & wax, engineered for spotless results.',
    primaryColor: '#0284C7',
    secondaryColor: '#84CC16',
    bgTint: 'bg-sky-50/80',
    borderTint: 'border-sky-200',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-200',
    buttonClass: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25',
    heroImage: '/images/bubbles-range-1.jpg',
    highlights: [
      'Heavy-Duty Home & Kitchen Care',
      'High-Foam Car Wash & Wax',
      'Concentrated Pine & Citrus Gels',
    ],
  },
};

export const BRAND_LIST: BrandInfo[] = [
  BRANDS.gladchemistry,
  BRANDS['felis-be-glad'],
  BRANDS['bubbles-detergents'],
];
