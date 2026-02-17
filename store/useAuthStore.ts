import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type UserRole = "user" | "store" | "service" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  login: async (email: string, _password: string) => {
    // TODO: Replace with real API call
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email,
      role: "user",
    };
    const mockToken = "mock_jwt_token";

    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

    set({ user: mockUser, token: mockToken });
  },

  register: async (name: string, email: string, _password: string) => {
    // TODO: Replace with real API call
    const mockUser: User = {
      id: "2",
      name,
      email,
      role: "user",
    };
    const mockToken = "mock_jwt_token";

    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

    set({ user: mockUser, token: mockToken });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    set({ user: null, token: null });
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({ user, token, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },
}));

// Selectors
export const useIsAuthenticated = () =>
  useAuthStore((s) => s.user !== null && s.token !== null);

export const useUser = () => useAuthStore((s) => s.user);

export const useUserRole = () => useAuthStore((s) => s.user?.role ?? null);

export const useIsRole = (role: UserRole) =>
  useAuthStore((s) => s.user?.role === role);

export const useHasRole = (...roles: UserRole[]) =>
  useAuthStore((s) => s.user !== null && roles.includes(s.user.role));

export default useAuthStore;
