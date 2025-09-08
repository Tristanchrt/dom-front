// Extra safety: mock expo-font to avoid requiring native modules
jest.mock('expo-font', () => ({
  loadAsync: jest.fn().mockResolvedValue(undefined),
  isLoaded: jest.fn().mockReturnValue(true),
}));

if (!(global as any).setImmediate) {
  (global as any).setImmediate = (fn: any, ...args: any[]) => setTimeout(fn, 0, ...args);
}
if (!(global as any).clearImmediate) {
  (global as any).clearImmediate = (id: any) => clearTimeout(id);
}

jest.mock('expo-status-bar', () => ({
  __esModule: true,
  StatusBar: () => null,
}));

jest.mock('expo-router', () => {
  const router = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
  const Stack: any = ({ children }: any) => children;
  Stack.Screen = () => null;
  const Link = ({ children }: any) => children;
  const useLocalSearchParams = jest.fn(() => ({}));
  return { __esModule: true, router, Stack, Link, useLocalSearchParams };
});
