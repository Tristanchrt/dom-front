import { Conversation } from '@/domain/models/Message';

export const messagingUsers = {
  u1: {
    id: 'u1',
    name: 'MICHEL PAGE',
    username: 'michel.page',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    email: 'michel@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  u2: {
    id: 'u2',
    name: 'Marie Dubois',
    username: 'marie.dubois',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    email: 'marie@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  u3: {
    id: 'u3',
    name: 'Pierre Martin',
    username: 'pierre.martin',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    email: 'pierre@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const conversationsFixture: Conversation[] = [
  {
    id: 'u1',
    user: messagingUsers.u1,
    lastMessage: 'Salut ! Comment ça va ?',
    timestamp: '10:30',
    unreadCount: 2,
    hasNewMessage: true,
  },
  {
    id: 'u2',
    user: messagingUsers.u2,
    lastMessage: 'Merci pour les infos !',
    timestamp: '09:15',
    unreadCount: 0,
    hasNewMessage: false,
  },
  {
    id: 'u3',
    user: messagingUsers.u3,
    lastMessage: 'Parfait, on se parle demain',
    timestamp: 'Hier',
    unreadCount: 1,
    hasNewMessage: true,
  },
];

export const messagesFixture: Record<string, Array<{ id: string; content: string; senderId: string; timestamp: Date }>> = {
  u1: [
    { id: 'm1', content: 'Salut ! Comment ça va ?', senderId: 'u1', timestamp: new Date() },
    { id: 'm2', content: 'Ça va bien merci ! Et toi ?', senderId: 'me', timestamp: new Date() },
    { id: 'm3', content: "Super ! J'aimerais discuter de ton projet", senderId: 'u1', timestamp: new Date() },
  ],
  u2: [
    { id: 'm6', content: 'Merci pour les infos !', senderId: 'u2', timestamp: new Date() },
  ],
  u3: [
    { id: 'm7', content: 'Parfait, on se parle demain', senderId: 'u3', timestamp: new Date() },
  ],
};


