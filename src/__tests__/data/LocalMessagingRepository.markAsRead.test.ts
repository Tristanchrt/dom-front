import { LocalMessagingRepository } from '@/data/repositories/LocalMessagingRepository.impl';
import { LocalStore } from '@/data/storage/LocalStore';

describe('LocalMessagingRepository markAsRead', () => {
  it('marks a message as read', async () => {
    LocalStore.setJSON('conversations', [{ id: 'u1' }]);
    LocalStore.setJSON('messages:u1', [{ id: 'm1', isRead: false }, { id: 'm2', isRead: false }]);

    const repo = new LocalMessagingRepository();
    await repo.markAsRead('m1');

    const list = LocalStore.getJSON<any[]>('messages:u1', []);
    expect(list.find(m => m.id === 'm1')?.isRead).toBe(true);
    expect(list.find(m => m.id === 'm2')?.isRead).toBe(false);
  });
});


