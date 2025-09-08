export interface InterestFixture {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const availableInterests: InterestFixture[] = [
  { id: '1', name: 'Livres & Écriture', icon: 'book', color: '#3F51B5' },
  { id: '2', name: 'Art Visuel', icon: 'paint-brush', color: '#E91E63' },
  { id: '3', name: 'Musique & Son', icon: 'music', color: '#FF9800' },
  { id: '4', name: 'Objets Artisanaux', icon: 'hand-paper-o', color: '#9C27B0' },
  { id: '5', name: 'Mode & Accessoires', icon: 'shopping-bag', color: '#795548' },
  { id: '6', name: 'Maison & Décoration', icon: 'home', color: '#4CAF50' },
  { id: '7', name: 'Papeterie & Illustration', icon: 'pencil', color: '#FF5722' },
  { id: '8', name: 'Jeux & Univers Ludiques', icon: 'gamepad', color: '#673AB7' },
  { id: '9', name: 'DIY & Matériaux créatifs', icon: 'wrench', color: '#607D8B' },
  { id: '10', name: 'Bien-être & Art de Vivre', icon: 'heartbeat', color: '#F44336' },
  { id: '11', name: 'Expériences & Services Créatifs', icon: 'star', color: '#E91E63' },
];

export const profileSetupDefaults = {
  heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop',
  defaultProfileCameraUrl:
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
  defaultProfileGalleryUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  defaultBannerCameraUrl:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
  defaultBannerGalleryUrl:
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=200&fit=crop',
};
