import { LocalStore } from '@/data/storage/LocalStore';

describe('LocalStore', () => {
  it('set/get string works', () => {
    LocalStore.set('k', 'v');
    expect(LocalStore.get('k')).toBe('v');
  });

  it('getJSON returns fallback for missing or invalid', () => {
    expect(LocalStore.getJSON('missing', 123)).toBe(123);
    LocalStore.set('bad', '{bad json');
    expect(LocalStore.getJSON('bad', { ok: true })).toEqual({ ok: true });
  });

  it('setJSON persists and reads back', () => {
    const value = { a: 1, b: 'x' };
    LocalStore.setJSON('obj', value);
    expect(LocalStore.getJSON('obj', null)).toEqual(value);
  });
});
