type JsonValue = unknown;

class MemoryStorage {
  private map = new Map<string, string>();
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.map.set(key, value);
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
}

const getStorage = () => {
  try {
    // @ts-ignore
    const ls: Storage | undefined = globalThis?.localStorage;
    if (ls && typeof ls.getItem === 'function') return ls;
  } catch (_) {}
  return new MemoryStorage();
};

const storage = getStorage();

export const LocalStore = {
  get(key: string): string | null {
    return storage.getItem(key);
  },
  set(key: string, value: string): void {
    storage.setItem(key, value);
  },
  remove(key: string): void {
    storage.removeItem(key);
  },
  getJSON<T = JsonValue>(key: string, fallback: T): T {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  setJSON<T = JsonValue>(key: string, value: T): void {
    storage.setItem(key, JSON.stringify(value));
  },
};
