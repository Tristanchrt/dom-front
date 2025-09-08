// Fixtures for Settings pages

export type SettingsOrder = {
  id: string;
  productName: string;
  customerName: string;
  price: string; // e.g., "15 €"
  status: 'Paid' | 'Pending' | 'Cancelled';
  date: string; // ISO string
  image: string;
  quantity: number;
};

export const settingsOrders: SettingsOrder[] = [
  {
    id: 'o1',
    productName: 'T-shirt cousu main',
    customerName: 'Marie Dubois',
    price: '15 €',
    status: 'Paid',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    quantity: 1,
  },
  {
    id: 'o2',
    productName: 'T-shirt cousu main',
    customerName: 'Pierre Martin',
    price: '15 €',
    status: 'Paid',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    quantity: 1,
  },
];

export type SettingsSellerProduct = {
  id: string;
  name: string;
  price: string; // e.g., "30 €"
  status: 'Active' | 'Draft';
  image: string;
  sales: number;
  views: number;
};

export const settingsSellerProducts: SettingsSellerProduct[] = [
  {
    id: 'mp1',
    name: 'T-shirt cousu main',
    price: '30 €',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    sales: 45,
    views: 234,
  },
  {
    id: 'mp2',
    name: 'T-shirt cousu main',
    price: '30 €',
    status: 'Draft',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    sales: 0,
    views: 12,
  },
];


export type ProfileDraft = {
  name: string;
  status: string;
  description: string;
  category: string;
  socialLinks: string;
  avatarUrl: string;
};

export const profileEditDefaults: ProfileDraft = {
  name: 'Marilyn Aminoff',
  status: 'online',
  description: '',
  category: '',
  socialLinks: '',
  avatarUrl:
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
};
