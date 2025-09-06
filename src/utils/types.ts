// Common TypeScript utility types for the application

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}>;

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  Profile: { id: string };
  Post: { id: string };
  Chat: { id: string };
  Settings: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Create: undefined;
  Messaging: undefined;
  Profile: undefined;
};

// Form validation types
export type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
};

export type FormValidation<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};
