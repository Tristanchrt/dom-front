import { MessagingRepository } from '@domain/usecases/messaging/MessagingUseCases';
import { Message, ConversationsResponse, CreateMessageRequest } from '@domain/models/Message';
import { LocalStore } from '@data/storage/LocalStore';

const CONV_KEY = 'conversations';
const MSG_KEY_PREFIX = 'messages:';

export class LocalMessagingRepository implements MessagingRepository {
  async getConversations(): Promise<ConversationsResponse> {
    const conversations = LocalStore.getJSON(CONV_KEY, []);
    return { conversations, total: conversations.length };
  }
  async getMessages(conversationId: string): Promise<Message[]> {
    return LocalStore.getJSON<Message[]>(`${MSG_KEY_PREFIX}${conversationId}`, []);
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


