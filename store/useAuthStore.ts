import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { formatInitials } from "@/features/profile/utils/formatters";
import { resolveImageUrl } from "@/features/profile/utils/resolveImage";
import type { SellerType } from "@/types/enums";
import type { Seller } from "@/types/user";

interface AuthState {
  seller: Seller | null;
  token: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  biometricEnabled: boolean;
  requiresBiometric: boolean;

  // Actions
  setSession: (
    token: string,
    seller: Seller,
    refreshToken?: string,
  ) => Promise<void>;
  updateToken: (token: string) => Promise<void>;
  refreshSeller: (seller: Seller) => Promise<void>;
  updateProfileImage: (imageUrl: string) => Promise<void>;
  updateCoverImage: (imageUrl: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  unlockWithBiometric: () => void;
}

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const SELLER_KEY = "auth_seller";
const BIOMETRIC_KEY = "biometric_enabled";

const useAuthStore = create<AuthState>()((set) => ({
  seller: null,
  token: null,
  refreshToken: null,
  isHydrated: false,
  biometricEnabled: false,
  requiresBiometric: false,

  setSession: async (token: string, seller: Seller, refreshToken?: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(SELLER_KEY, JSON.stringify(seller));
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
    set({ token, seller, ...(refreshToken ? { refreshToken } : {}) });
  },

  updateToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token });
  },

  refreshSeller: async (seller: Seller) => {
    await SecureStore.setItemAsync(SELLER_KEY, JSON.stringify(seller));
    set({ seller });
  },

  updateProfileImage: async (imageUrl: string) => {
    const seller = useAuthStore.getState().seller;
    if (!seller?.profile) return;
    const updatedProfile =
      seller.profile.__typename === "PersonProfile"
        ? { ...seller.profile, profileImage: imageUrl }
        : { ...seller.profile, logo: imageUrl };
    const updatedSeller = { ...seller, profile: updatedProfile };
    set({ seller: updatedSeller });
    await SecureStore.setItemAsync(SELLER_KEY, JSON.stringify(updatedSeller));
  },

  updateCoverImage: async (imageUrl: string) => {
    const seller = useAuthStore.getState().seller;
    if (!seller?.profile) return;
    const updatedProfile = { ...seller.profile, coverImage: imageUrl };
    const updatedSeller = { ...seller, profile: updatedProfile };
    set({ seller: updatedSeller });
    await SecureStore.setItemAsync(SELLER_KEY, JSON.stringify(updatedSeller));
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(SELLER_KEY);
    set({
      seller: null,
      token: null,
      refreshToken: null,
      requiresBiometric: false,
    });
  },

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const sellerJson = await SecureStore.getItemAsync(SELLER_KEY);
      const biometricEnabled =
        (await SecureStore.getItemAsync(BIOMETRIC_KEY)) === "true";

      if (token && sellerJson) {
        const seller = JSON.parse(sellerJson) as Seller;
        set({
          seller,
          token,
          refreshToken,
          isHydrated: true,
          biometricEnabled,
          requiresBiometric: biometricEnabled,
        });
      } else {
        set({ isHydrated: true, biometricEnabled });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  setBiometricEnabled: async (enabled: boolean) => {
    await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? "true" : "false");
    set({ biometricEnabled: enabled });
  },

  unlockWithBiometric: () => {
    set({ requiresBiometric: false });
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

export const useSellerProfile = () => useAuthStore((s) => s.seller?.profile);

export const useIsPersonProfile = () =>
  useAuthStore((s) => s.seller?.profile?.__typename === "PersonProfile");

export const useIsBusinessProfile = () =>
  useAuthStore((s) => s.seller?.profile?.__typename === "BusinessProfile");

export const useDisplayName = () =>
  useAuthStore((s) => {
    const profile = s.seller?.profile;
    if (!profile) return s.seller?.email ?? "";
    if (profile.__typename === "PersonProfile") {
      if (profile.displayName) return profile.displayName;
      return (
        [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
        s.seller?.email ||
        ""
      );
    }
    return profile.businessName ?? s.seller?.email ?? "";
  });

export const useProfileImage = () =>
  useAuthStore((s) => {
    const profile = s.seller?.profile;
    if (!profile) return undefined;
    const rawPath =
      profile.__typename === "PersonProfile"
        ? profile.profileImage
        : (profile as any).logo;
    return resolveImageUrl(rawPath);
  });

export const useCoverImage = () =>
  useAuthStore((s) => resolveImageUrl(s.seller?.profile?.coverImage));

export const useInitials = () =>
  useAuthStore((s) => {
    const profile = s.seller?.profile;
    const name =
      profile?.__typename === "PersonProfile"
        ? profile.displayName ||
          [profile.firstName, profile.lastName].filter(Boolean).join(" ")
        : (profile as any)?.businessName;
    return formatInitials(name || s.seller?.email || "");
  });

export default useAuthStore;
