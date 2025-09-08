// Fixtures for the Shop screen (product cards + categories)

export type ShopProductCard = {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  seller: string;
  category: string;
  rating: number;
  sales: number;
  liked: boolean;
  description: string;
};

export const shopProducts: ShopProductCard[] = [
  {
    id: 'p1',
    name: 'T-shirt coutumain',
    price: '30 €',
    originalPrice: '45 €',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    seller: 'Marin',
    category: 'Poterie',
    rating: 4.8,
    sales: 234,
    liked: false,
    description: 'T-shirt artisanal en coton bio avec design unique fait main',
  },
  {
    id: 'p2',
    name: 'Vase en céramique',
    price: '45 €',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    seller: 'Art Studio',
    category: 'Poterie',
    rating: 4.9,
    sales: 156,
    liked: true,
    description: 'Vase artisanal en céramique peint à la main',
  },
  {
    id: 'p3',
    name: 'Livre de recettes',
    price: '25 €',
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop',
    seller: 'Chef Antoine',
    category: 'Livre Image',
    rating: 4.7,
    sales: 89,
    liked: false,
    description: 'Recettes traditionnelles françaises avec photos étape par étape',
  },
  {
    id: 'p4',
    name: 'Carte postale vintage',
    price: '5 €',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    seller: 'Travel Explorer',
    category: 'Carte custom',
    rating: 4.6,
    sales: 345,
    liked: false,
    description: "Collection de cartes postales vintage d'Islande",
  },
  {
    id: 'p5',
    name: 'Carnet de voyage',
    price: '18 €',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
    seller: 'Travel Explorer',
    category: 'Carnet',
    rating: 4.8,
    sales: 167,
    liked: true,
    description: 'Carnet de voyage en cuir avec pages lignées et cartes',
  },
  {
    id: 'p6',
    name: 'Bol artisanal',
    price: '35 €',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    seller: 'Art Studio',
    category: 'Poterie',
    rating: 4.9,
    sales: 78,
    liked: false,
    description: 'Bol en grès émaillé, parfait pour les petits déjeuners',
  },
  {
    id: 'p7',
    name: 'Guide de cuisine',
    price: '32 €',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=300&fit=crop',
    seller: 'Chef Antoine',
    category: 'Livre Image',
    rating: 4.8,
    sales: 234,
    liked: false,
    description: 'Guide complet de la cuisine française moderne',
  },
  {
    id: 'p8',
    name: 'Carte personnalisée',
    price: '12 €',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    seller: 'Design Studio',
    category: 'Carte custom',
    rating: 4.7,
    sales: 445,
    liked: true,
    description: 'Carte personnalisée avec votre photo et message',
  },
];

export type ShopCategory = { id: string; name: string; icon: string };

export const shopCategories: ShopCategory[] = [
  { id: 'all', name: 'Tous', icon: 'th-large' },
  { id: 'Poterie', name: 'Poterie', icon: 'circle' },
  { id: 'Livre Image', name: 'Livre Image', icon: 'book' },
  { id: 'Carte custom', name: 'Carte custom', icon: 'credit-card' },
  { id: 'Carnet', name: 'Carnet', icon: 'file-text' },
];
