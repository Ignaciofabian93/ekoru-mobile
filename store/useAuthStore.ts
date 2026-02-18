import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import type { SellerType } from "@/types/enums";
import type { Seller } from "@/types/user";

interface AuthState {
  seller: Seller | null;
  token: string | null;
  isHydrated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const TOKEN_KEY = "auth_token";
const SELLER_KEY = "auth_seller";

const useAuthStore = create<AuthState>()((set) => ({
  seller: null,
  token: null,
  isHydrated: false,

  login: async (_email: string, _password: string) => {
    // TODO: Replace with real API call
    const mockToken = "mock_jwt_token";

    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);

    set({ token: mockToken });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(SELLER_KEY);
    set({ seller: null, token: null });
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const sellerJson = await SecureStore.getItemAsync(SELLER_KEY);

      if (token && sellerJson) {
        const seller = JSON.parse(sellerJson) as Seller;
        set({ seller, token, isHydrated: true });
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
  useAuthStore((s) => s.seller !== null && s.token !== null);

export const useSeller = () => useAuthStore((s) => s.seller);

export const useSellerType = () =>
  useAuthStore((s) => s.seller?.sellerType ?? null);

export const useIsSellerType = (type: SellerType) =>
  useAuthStore((s) => s.seller?.sellerType === type);

export const useHasSellerType = (...types: SellerType[]) =>
  useAuthStore((s) => s.seller !== null && types.includes(s.seller.sellerType));

export default useAuthStore;
