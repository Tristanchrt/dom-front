import { LocalMessagingRepository } from '@/data/repositories/LocalMessagingRepository.impl';
import { LocalStore } from '@/data/storage/LocalStore';

describe('LocalMessagingRepository', () => {
  it('lists conversations and sends message', async () => {
    LocalStore.setJSON('conversations', [{ id: 'u1', user: { id: 'u1', name: 'A', username: 'a', avatar: '', isOnline: false, email: 'a@a.com', createdAt: new Date(), updatedAt: new Date() }, lastMessage: 'hi', timestamp: 'now', unreadCount: 0, hasNewMessage: false }]);
    const repo = new LocalMessagingRepository();
    const conv = await repo.getConversations();
    expect(conv.total).toBe(1);
    const sent = await repo.sendMessage({ content: 'yo', receiverId: 'u1' });
    expect(sent.content).toBe('yo');
    const msgs = await repo.getMessages('u1');
    expect(msgs.length).toBe(1);
  });
});


