import type { EdgeInsets } from 'react-native-safe-area-context';

export const HEADER_HORIZONTAL_PADDING = 16;
export const HEADER_MIN_TOP_PADDING = 8;
export const HEADER_BOTTOM_PADDING = 12;

export function computeHeaderPaddings(insets: EdgeInsets): { paddingTop: number; paddingBottom: number } {
  const paddingTop = Math.max(insets.top, HEADER_MIN_TOP_PADDING);
  const paddingBottom = HEADER_BOTTOM_PADDING;
  return { paddingTop, paddingBottom };
}


