// Fixtures for creator profiles used by profile page and as fallback in repository
import { productDetails } from './products';

function makeShopItem(productId: keyof typeof productDetails) {
  const p = productDetails[productId];
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    rating: p.rating,
    sales: p.sales,
  };
}
export const creatorProfiles = {
  c1: {
    id: 'c1',
    name: 'Marie Dubois',
    handle: '@mariedubois',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    followers: '12.5k',
    following: '890',
    postsCount: '156',
    verified: true,
    category: 'Lifestyle',
    bio: '✨ Créatrice de contenu lifestyle\n🌍 Voyageuse passionnée\n📸 Photographe amateur\n💫 Partage mes découvertes quotidiennes',
    location: 'Paris, France',
    joinDate: 'Janvier 2022',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        likes: 1250,
        comments: 34,
        content: "Magnifique coucher de soleil aujourd'hui ! 🌅",
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
        likes: 980,
        comments: 22,
        content: 'Nouvelle découverte culinaire 🍽️',
      },
      {
        id: 'p3',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
        likes: 2100,
        comments: 67,
        content: 'Art et créativité au rendez-vous 🎨',
      },
      {
        id: 'p4',
        image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop',
        likes: 1450,
        comments: 45,
        content: 'Moments précieux entre amis 💕',
      },
    ],
    shop: [
      makeShopItem('p1'),
      makeShopItem('p2'),
    ],
  },
  c2: {
    id: 'c2',
    name: 'Chef Antoine',
    handle: '@chefantoine',
    avatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=200&fit=crop',
    followers: '8.9k',
    following: '245',
    postsCount: '89',
    verified: false,
    category: 'Cuisine',
    bio: '👨‍🍳 Chef passionné depuis 15 ans\n🍽️ Cuisine française traditionnelle\n📚 Auteur de 3 livres de cuisine\n🎓 Formateur culinaire',
    location: 'Lyon, France',
    joinDate: 'Mars 2021',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop',
        likes: 2400,
        comments: 89,
        content: 'Risotto aux champignons et truffe noire 🍄',
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=300&fit=crop',
        likes: 1800,
        comments: 56,
        content: 'Tarte aux pommes traditionnelle 🥧',
      },
      {
        id: 'p3',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
        likes: 3200,
        comments: 124,
        content: 'Coq au vin de ma grand-mère 🍷',
      },
    ],
    shop: [
      makeShopItem('p3'),
      makeShopItem('p7'),
      makeShopItem('p6'),
    ],
  },
  c3: {
    id: 'c3',
    name: 'Travel Explorer',
    handle: '@travelexplorer',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    followers: '25.1k',
    following: '1.2k',
    postsCount: '234',
    verified: true,
    category: 'Voyage',
    bio: '🌍 Explorateur du monde entier\n✈️ 67 pays visités\n📸 Photographe de voyage\n🗺️ Guides et conseils voyage',
    location: 'Partout dans le monde',
    joinDate: 'Septembre 2020',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
        likes: 8200,
        comments: 156,
        content: 'Coucher de soleil en Islande 🇮🇸',
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
        likes: 5600,
        comments: 98,
        content: 'Aurores boréales magiques ✨',
      },
      {
        id: 'p3',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
        likes: 7800,
        comments: 134,
        content: 'Fjords norvégiens 🏔️',
      },
    ],
    shop: [
      makeShopItem('p4'),
      makeShopItem('p5'),
    ],
  },
  c4: {
    id: 'c4',
    name: 'Tech Guru',
    handle: '@techguru',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
    followers: '15.7k',
    following: '567',
    postsCount: '89',
    verified: true,
    category: 'Technologie',
    bio: "💻 Développeur Full Stack\n🤖 Passionné d'IA et Machine Learning\n📱 Expert React Native\n🚀 Entrepreneur tech",
    location: 'San Francisco, USA',
    joinDate: 'Mai 2021',
    posts: [
      {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop',
        likes: 5600,
        comments: 234,
        content: 'Les nouvelles tendances en IA 2024 🤖',
      },
      {
        id: 'p2',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=300&fit=crop',
        likes: 4200,
        comments: 189,
        content: 'React Native vs Flutter 📱',
      },
    ],
    shop: [],
  },
};
