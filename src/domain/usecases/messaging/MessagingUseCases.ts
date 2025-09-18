import {
  Message,
  Conversation,
  CreateMessageRequest,
  ConversationsResponse,
} from '../../models/Message';

export interface MessagingRepository {
  getConversations(): Promise<ConversationsResponse>;
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(request: CreateMessageRequest): Promise<Message>;
  markAsRead(messageId: string): Promise<void>;
}

export class MessagingUseCases {
  constructor(private messagingRepository: MessagingRepository) {}

  async getConversations(): Promise<ConversationsResponse> {
    return this.messagingRepository.getConversations();
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    return this.messagingRepository.getMessages(conversationId);
  }

  async sendMessage(request: CreateMessageRequest): Promise<Message> {
    if ((!request.content || request.content.trim().length === 0) && !request.imageUri) {
      throw new Error('Message must have text or image');
    }

    if (!request.receiverId) {
      throw new Error('Receiver ID is required');
    }

    if (request.content && request.content.length > 1000) {
      throw new Error('Message content cannot exceed 1000 characters');
    }

    const payload: CreateMessageRequest = {
      receiverId: request.receiverId,
      ...(request.content ? { content: request.content.trim() } : {}),
      ...(request.imageUri ? { imageUri: request.imageUri } : {}),
    };
    return this.messagingRepository.sendMessage(payload);
  }

  async markAsRead(messageId: string): Promise<void> {
    if (!messageId) {
      throw new Error('Message ID is required');
    }
    return this.messagingRepository.markAsRead(messageId);
  }
}
