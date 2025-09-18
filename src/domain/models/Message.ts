import { User } from './User';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  imageUri?: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  hasNewMessage: boolean;
}

export interface CreateMessageRequest {
  content?: string;
  receiverId: string;
  imageUri?: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
}
