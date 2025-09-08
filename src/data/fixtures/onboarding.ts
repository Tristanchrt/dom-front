export interface InterestFixture {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const availableInterests: InterestFixture[] = [
  { id: '1', name: 'Art & Design', icon: 'paint-brush', color: '#E91E63' },
  { id: '2', name: 'Photographie', icon: 'camera', color: '#9C27B0' },
  { id: '3', name: 'Cuisine', icon: 'cutlery', color: '#FF5722' },
  { id: '4', name: 'Voyage', icon: 'plane', color: '#2196F3' },
  { id: '5', name: 'Mode', icon: 'shopping-bag', color: '#795548' },
  { id: '6', name: 'Sport', icon: 'futbol-o', color: '#4CAF50' },
  { id: '7', name: 'Musique', icon: 'music', color: '#FF9800' },
  { id: '8', name: 'Technologie', icon: 'laptop', color: '#607D8B' },
  { id: '9', name: 'Lecture', icon: 'book', color: '#3F51B5' },
  { id: '10', name: 'Jardinage', icon: 'leaf', color: '#8BC34A' },
  { id: '11', name: 'Fitness', icon: 'heartbeat', color: '#F44336' },
  { id: '12', name: 'Cinéma', icon: 'film', color: '#9E9E9E' },
  { id: '13', name: 'Gaming', icon: 'gamepad', color: '#673AB7' },
  { id: '14', name: 'Beauté', icon: 'star', color: '#E91E63' },
  { id: '15', name: 'Animaux', icon: 'paw', color: '#FF5722' },
  { id: '16', name: 'Architecture', icon: 'building', color: '#795548' },
  { id: '17', name: 'Écriture', icon: 'pencil', color: '#FF9800' },
  { id: '18', name: 'Danse', icon: 'music', color: '#E91E63' },
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
