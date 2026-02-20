import useLocationStore from "@/store/useLocationStore";
import * as ExpoLocation from "expo-location";
import { useEffect } from "react";

// Maps ISO 3166-1 alpha-2 country codes to their default locale
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  AR: "es-AR",
  BO: "es-BO",
  BR: "pt-BR",
  CA: "en-CA",
  CL: "es-CL",
  CO: "es-CO",
  DE: "de-DE",
  ES: "es-ES",
  FR: "fr-FR",
  GB: "en-GB",
  IT: "it-IT",
  MX: "es-MX",
  PE: "es-PE",
  PY: "es-PY",
  UY: "es-UY",
  US: "en-US",
  VE: "es-VE",
};

function getLocaleFromIsoCode(isoCode: string): string {
  return COUNTRY_LOCALE_MAP[isoCode.toUpperCase()] ?? "en-US";
}

/**
 * useLocationDetection — runs once after location store is hydrated.
 * If the user has no confirmed location yet, it requests foreground
 * permission and reverse-geocodes the device coords to a country + city.
 * The result is stored in useLocationStore as `detected`, which triggers
 * the LocationConfirmModal.
 */
export default function useLocationDetection() {
  const isConfirmed = useLocationStore((s) => s.isConfirmed);
  const isHydrated = useLocationStore((s) => s.isHydrated);
  const setDetected = useLocationStore((s) => s.setDetected);

  useEffect(() => {
    // Only run detection if the store is ready and no location confirmed yet
    if (!isHydrated || isConfirmed) return;
    detect();
  }, [isHydrated, isConfirmed]);

  const detect = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const position = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Low,
      });

      const [geocode] = await ExpoLocation.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (!geocode) return;

      const isoCode = geocode.isoCountryCode ?? "US";
      const locale = getLocaleFromIsoCode(isoCode);

      setDetected({
        country: geocode.country ?? isoCode,
        isoCode,
        city: geocode.city ?? geocode.subregion ?? geocode.region ?? "",
        locale,
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
      });
    } catch {
      // Silently fail — the modal simply won't appear
    }
  };
}
