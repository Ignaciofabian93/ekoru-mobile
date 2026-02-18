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

// TODO: Remove before production
const DEV_MOCK_SELLER: Seller = {
  id: "mock-seller-1",
  email: "jane@ekoru.com",
  password: "",
  sellerType: "PERSON",
  isActive: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  points: 320,
  profile: {
    __typename: "PersonProfile",
    id: "mock-profile-1",
    sellerId: "mock-seller-1",
    firstName: "Jane",
    lastName: "Doe",
    displayName: "Jane Doe",
    allowExchanges: true,
    personSubscriptionPlan: "BASIC",
  },
  sellerLevel: {
    id: 2,
    levelName: "Eco Warrior",
    minPoints: 100,
    maxPoints: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  phone: "+56 9 1234 5678",
  address: "Av. Providencia 1234, Piso 3",
  country: { id: 1, country: "Chile" },
  region: { id: 1, region: "Región Metropolitana", countryId: 1 },
  city: { id: 1, city: "Santiago", regionId: 1 },
  county: { id: 1, county: "Providencia", cityId: 1 },
};

const useAuthStore = create<AuthState>()((set) => ({
  seller: DEV_MOCK_SELLER,
  token: "mock_jwt_token",
  isHydrated: false,

  login: async (_email: string, _password: string) => {
    // TODO: Replace with real API call
    const mockToken = "mock_jwt_token";

    const mockSeller: Seller = {
      id: "mock-seller-1",
      email: _email,
      password: "",
      sellerType: "PERSON",
      isActive: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      points: 320,
      profile: {
        __typename: "PersonProfile",
        id: "mock-profile-1",
        sellerId: "mock-seller-1",
        firstName: "Jane",
        lastName: "Doe",
        displayName: "Jane Doe",
        allowExchanges: true,
        personSubscriptionPlan: "BASIC",
      },
      sellerLevel: {
        id: 2,
        levelName: "Eco Warrior",
        minPoints: 100,
        maxPoints: 500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      phone: "+56 9 1234 5678",
      address: "Av. Providencia 1234, Piso 3",
      country: { id: 1, country: "Chile" },
      region: { id: 1, region: "Región Metropolitana", countryId: 1 },
      city: { id: 1, city: "Santiago", regionId: 1 },
      county: { id: 1, county: "Providencia", cityId: 1 },
    };

    await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
    await SecureStore.setItemAsync(SELLER_KEY, JSON.stringify(mockSeller));

    set({ token: mockToken, seller: mockSeller });
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
