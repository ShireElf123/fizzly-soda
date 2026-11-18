import type { BrandId } from './brands';

export interface Product {
  id: string;
  name: string;
  preMessage: string;
  brand: BrandId;
  category: string;
  price: number;
  size: string;
  variants?: string[];
  notes?: string[];
  description: string;
  image: string;
  badge?: string;
  featured?: boolean;
}

export const PRODUCTS: Product[] = [
  // Gladchemistry — Organic Personal Care
  {
    id: 'gc-bath-fizzies',
    preMessage: "Botanical Effervescence · Skin-Softening Mineral Blend",
    variants: ["1kg Bucket", "2kg Salon Tub"],
    notes: ["Citrus Zest", "Sea Minerals", "Sweet Almond Oil"],
    name: 'Artisan Bath Fizzies Tub',
    brand: 'gladchemistry',
    category: 'Bath & Body',
    price: 185,
    size: '1kg Bucket',
    description:
      'Effervescent mineral bath fizzies in vibrant citrus, berry, and ocean botanical blends that soften skin and uplift the senses.',
    image: '/images/bath-fizzies.jpg',
    badge: 'Bestseller',
    featured: true,
  },
  {
    id: 'gc-foam-bath',
    preMessage: "Velvet Hydration · pH-Balanced Botanical Foam",
    variants: ["1.5L Family", "500ml Travel"],
    notes: ["Organic Rose", "Aloe Vera", "Vegetable Glycerine"],
    name: 'Organic Rose & Aloe Foam Bath',
    brand: 'gladchemistry',
    category: 'Bath & Body',
    price: 125,
    size: '1.5L',
    description:
      'Rich, velvety foaming bath elixir enriched with glycerine and natural botanicals for deep hydration.',
    image: '/images/bubbles-range-2.jpg',
    badge: 'Organic',
    featured: true,
  },
  {
    id: 'gc-bicarb',
    preMessage: "Pure Mineral Detox · Multi-Use Natural Care",
    variants: ["500g Pouch", "1kg Tub"],
    notes: ["100% Pure Sodium Bicarbonate", "Zero Additives"],
    name: 'Pure Bicarbonate of Soda',
    brand: 'gladchemistry',
    category: 'Personal Care',
    price: 55,
    size: '500g',
    description:
      'Pharmaceutical-grade multipurpose bicarbonate of soda for natural exfoliation, bath soaks, and eco-friendly care.',
    image: '/images/bubbles-range-2.jpg',
  },
  {
    id: 'gc-sanitizer',
    preMessage: "70% Alcohol Defense · Non-Drying Aloe Formula",
    variants: ["100ml Mist", "500ml Pump"],
    notes: ["70% Ethanol", "Soothing Aloe", "Tea Tree"],
    name: 'Waterless Hand Sanitizer Rub',
    brand: 'gladchemistry',
    category: 'Personal Care',
    price: 45,
    size: '100ml',
    description:
      '70% alcohol-based botanical hand sanitizer rub with soothing aloe vera to protect without drying.',
    image: '/images/bubbles-range-1.jpg',
  },

  // Felis be Glad — Fine Fragrances, Home Diffusers & Car Perfumes
  {
    id: 'fbg-reed-diffuser',
    preMessage: "12-Week Continuous Scent · Hand-Poured Elixir",
    variants: ["100ml + Reeds", "200ml Refill"],
    notes: ["Warm Amber", "Sandalwood", "Vanilla Bean"],
    name: 'Signature Amber Reed Diffuser',
    brand: 'felis-be-glad',
    category: 'Home Diffusers',
    price: 240,
    size: '100ml + Black Reeds',
    description:
      'Hand-poured luxury home fragrance oil in a crystal-cut square flacon with matte black rattan reeds for 12+ weeks of continuous scent.',
    image: '/images/reed-diffuser.jpg',
    badge: 'Luxury Home',
    featured: true,
  },
  {
    id: 'fbg-scandal-ladies',
    preMessage: "High-Sillage Parfum · Captivating Honey & Floral",
    variants: ["30ml EDP", "50ml EDP", "100ml EDP"],
    notes: ["Wild Honey", "Gardenia", "Blood Orange"],
    name: 'Inspired by Scandal Ladies',
    brand: 'felis-be-glad',
    category: 'Fine Fragrances',
    price: 195,
    size: '30ml Eau de Parfum',
    description:
      'Captivating honey, gardenia, and blood orange notes in a sleek sculpted teal glass flacon.',
    image: '/images/felis-fragrances.jpg',
    badge: 'Top Pick',
    featured: true,
  },
  {
    id: 'fbg-hugo-men',
    preMessage: "Crisp Aromatic Signature · All-Day Confidence",
    variants: ["100ml EDP", "50ml EDP"],
    notes: ["Green Apple", "Sage", "Cedarwood"],
    name: 'Inspired by Hugo Men',
    brand: 'felis-be-glad',
    category: 'Fine Fragrances',
    price: 260,
    size: '100ml Eau de Parfum',
    description:
      'Crisp green apple, aromatic sage, and cedarwood crafted for all-day confidence.',
    image: '/images/felis-fragrances.jpg',
  },
  {
    id: 'fbg-diesel-men',
    preMessage: "Bold Woody Spice · Evening & Statement Scent",
    variants: ["30ml EDP", "100ml EDP"],
    notes: ["Grapefruit", "Lavender", "Warm Amber"],
    name: 'Inspired by Diesel Men',
    brand: 'felis-be-glad',
    category: 'Fine Fragrances',
    price: 195,
    size: '30ml Eau de Parfum',
    description:
      'Bold spicy-woody fragrance with grapefruit, lavender, and warm amber undertones.',
    image: '/images/felis-fragrances.jpg',
  },
  {
    id: 'fbg-car-perfume',
    preMessage: "Concentrated Cabin & Travel Oil · Zero Spill",
    variants: ["15ml Roll-On", "15ml Hanging Diffuser"],
    notes: ["Pineapple", "Incense", "Rich Woods"],
    name: 'Inspired by Ted Lapidus Car & Roll-On',
    brand: 'felis-be-glad',
    category: 'Car Perfumes',
    price: 85,
    size: '15ml',
    description:
      'Concentrated fine fragrance oil designed for effortless application and long-lasting cabin freshness.',
    image: '/images/felis-fragrances.jpg',
    badge: 'Auto & Travel',
  },

  // Bubbles Detergents — Home Care & Car Detergents
  {
    id: 'bd-car-wash',
    preMessage: "Showroom Gloss · High-Foam Carnauba Wax",
    variants: ["5L Jerry Can", "1L Bottle"],
    notes: ["Carnauba Wax", "pH-Neutral Surfactants"],
    name: 'Bubbles Car Wash & Wax',
    brand: 'bubbles-detergents',
    category: 'Car Care',
    price: 165,
    size: '5L Jerry Can',
    description:
      'High-foam pH-balanced car shampoo infused with carnauba wax for a streak-free, showroom shine.',
    image: '/images/bubbles-car-wash.jpg',
    badge: 'Auto Care',
    featured: true,
  },
  {
    id: 'bd-thick-bleach',
    preMessage: "99.9% Germ Elimination · Clinging Stain Remover",
    variants: ["750ml", "5L Bulk"],
    notes: ["Active Chlorine", "Thickened Gel"],
    name: 'Bubbles Thick Bleach',
    brand: 'bubbles-detergents',
    category: 'Home Care',
    price: 42,
    size: '750ml',
    description:
      'Clinging thick bleach formula that eliminates 99.9% of germs, removes tough stains, and whitens surfaces.',
    image: '/images/bubbles-trio.jpg',
  },
  {
    id: 'bd-dishwashing',
    preMessage: "Ultra Grease-Cutter · Fresh Lemon Hygiene",
    variants: ["750ml", "5L Bulk"],
    notes: ["Lemon Extract", "Concentrated Foam"],
    name: 'Hygiene Dishwashing Liquid',
    brand: 'bubbles-detergents',
    category: 'Home Care',
    price: 38,
    size: '750ml',
    description:
      'Ultra-concentrated grease-cutting dishwashing liquid with fresh lemon fragrance.',
    image: '/images/bubbles-trio.jpg',
    featured: true,
  },
  {
    id: 'bd-pine-gel',
    preMessage: "Heavy-Duty Disinfectant · Long-Lasting Pine",
    variants: ["1kg Tub", "5kg Bucket"],
    notes: ["Pure Pine Oil", "Deep Clean Gel"],
    name: 'Bubbles Pine Gel',
    brand: 'bubbles-detergents',
    category: 'Home Care',
    price: 65,
    size: '1kg Tub',
    description:
      'Heavy-duty pine disinfectant gel that cleans, deodorizes, and leaves floors sparkling.',
    image: '/images/bubbles-trio.jpg',
  },
  {
    id: 'bd-citrus-gel',
    preMessage: "Zesty Degreaser · Kitchen & Surface Power",
    variants: ["1kg Tub", "5kg Bucket"],
    notes: ["Sweet Orange", "Active Degreasers"],
    name: 'Bubbles Citrus Gel',
    brand: 'bubbles-detergents',
    category: 'Home Care',
    price: 65,
    size: '1kg Tub',
    description:
      'Zesty citrus-powered cleaning gel for kitchens, bathrooms, and high-traffic surfaces.',
    image: '/images/bubbles-range-2.jpg',
  },
  {
    id: 'bd-all-purpose',
    preMessage: "Streak-Free Shine · Everyday Surface Care",
    variants: ["750ml", "5L Bulk"],
    notes: ["Fresh Lemon", "Quick-Dry Formula"],
    name: 'All-Purpose Cleaner',
    brand: 'bubbles-detergents',
    category: 'Home Care',
    price: 44,
    size: '750ml',
    description:
      'Versatile lemon-fresh surface cleaner that cuts through stubborn dirt and grime.',
    image: '/images/bubbles-trio.jpg',
  },
  {
    id: 'bd-black-dip',
    preMessage: "Industrial Sanitation · Drains & Outdoor Care",
    variants: ["1L", "5L Bulk"],
    notes: ["Heavy-Duty Disinfectant", "Odor Neutralizer"],
    name: 'Household Hygiene Black Dip',
    brand: 'bubbles-detergents',
    category: 'Home Care',
    price: 75,
    size: '1L',
    description:
      'Industrial-strength disinfectant fluid for drains, outdoor areas, and deep sanitation.',
    image: '/images/bubbles-range-1.jpg',
  },
];
