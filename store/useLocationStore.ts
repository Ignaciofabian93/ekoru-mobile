import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

const LOCATION_KEY = "app_location";

export type DetectedLocation = {
  country: string; // "Chile"
  isoCode: string; // "CL"
  city: string; // "Santiago"
  locale: string; // "es-CL"
  coords: {
    latitude: number;
    longitude: number;
  };
};

interface LocationState {
  detected: DetectedLocation | null;
  confirmed: DetectedLocation | null;
  isConfirmed: boolean;
  isHydrated: boolean;

  // Actions
  setDetected: (location: DetectedLocation) => void;
  dismissDetected: () => void;
  confirm: () => Promise<void>;
  override: (location: DetectedLocation) => Promise<void>;
  clear: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const useLocationStore = create<LocationState>()((set, get) => ({
  detected: null,
  confirmed: null,
  isConfirmed: false,
  isHydrated: false,

  setDetected: (location) => set({ detected: location }),

  dismissDetected: () => set({ detected: null }),

  confirm: async () => {
    const { detected } = get();
    if (!detected) return;
    await SecureStore.setItemAsync(LOCATION_KEY, JSON.stringify(detected));
    set({ confirmed: detected, isConfirmed: true });
  },

  override: async (location) => {
    await SecureStore.setItemAsync(LOCATION_KEY, JSON.stringify(location));
    set({ detected: location, confirmed: location, isConfirmed: true });
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(LOCATION_KEY);
    set({ detected: null, confirmed: null, isConfirmed: false });
  },

  hydrate: async () => {
    try {
      const raw = await SecureStore.getItemAsync(LOCATION_KEY);
      if (raw) {
        const confirmed = JSON.parse(raw) as DetectedLocation;
        set({ confirmed, isConfirmed: true, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },
}));

// Selectors
export const useDetectedLocation = () => useLocationStore((s) => s.detected);
export const useConfirmedLocation = () => useLocationStore((s) => s.confirmed);
export const useIsLocationConfirmed = () =>
  useLocationStore((s) => s.isConfirmed);
export const useLocationCoords = () =>
  useLocationStore((s) => s.confirmed?.coords ?? null);
export const useAppLocale = () =>
  useLocationStore((s) => s.confirmed?.locale ?? "en");

export default useLocationStore;
