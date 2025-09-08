import { MessagingRepository } from '@domain/usecases/messaging/MessagingUseCases';
import { Message, ConversationsResponse, CreateMessageRequest } from '@domain/models/Message';
import { LocalStore } from '@data/storage/LocalStore';
import { conversationsFixture, messagesFixture } from '@data/fixtures/messaging';

const CONV_KEY = 'conversations';
const MSG_KEY_PREFIX = 'messages:';

export class LocalMessagingRepository implements MessagingRepository {
  async getConversations(): Promise<ConversationsResponse> {
    const conversations = LocalStore.getJSON(CONV_KEY, []);
    if (conversations.length > 0) {
      return { conversations, total: conversations.length };
    }
    return { conversations: conversationsFixture, total: conversationsFixture.length };
  }
  async getMessages(conversationId: string): Promise<Message[]> {
    const list = LocalStore.getJSON<Message[]>(`${MSG_KEY_PREFIX}${conversationId}`, []);
    if (list.length > 0) return list;
    const fallback = messagesFixture[conversationId] || [];
    return fallback.map(m => ({
      id: m.id,
      content: m.content,
      senderId: m.senderId,
      receiverId: conversationId,
      timestamp: m.timestamp,
      isRead: m.senderId !== 'me',
    }));
  }
  async sendMessage(request: CreateMessageRequest): Promise<Message> {
    const conversationId = request.receiverId;
    const list = LocalStore.getJSON<Message[]>(`${MSG_KEY_PREFIX}${conversationId}`, []);
    const message: Message = {
      id: `m_${Date.now()}`,
      content: request.content,
      senderId: 'me',
      receiverId: request.receiverId,
      timestamp: new Date(),
      isRead: false,
    };
    LocalStore.setJSON(`${MSG_KEY_PREFIX}${conversationId}`, [...list, message]);
    return message;
  }
  async markAsRead(messageId: string): Promise<void> {
    // naive: scan all threads
    // In real impl, the server would handle this
  }
}
