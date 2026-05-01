import useLocationStore from "@/store/useLocationStore";
import * as expoLocation from "expo-location";
import { useEffect } from "react";

// Maps ISO 3166-1 alpha-2 country codes to their ISO 4217 currency code
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  AR: "ARS",
  BO: "BOB",
  BR: "BRL",
  CA: "CAD",
  CL: "CLP",
  CO: "COP",
  DE: "EUR",
  ES: "EUR",
  FR: "EUR",
  GB: "GBP",
  IT: "EUR",
  MX: "MXN",
  PE: "PEN",
  PY: "PYG",
  UY: "UYU",
  US: "USD",
  VE: "VES",
};

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

function getCurrencyFromIsoCode(isoCode: string): string {
  return COUNTRY_CURRENCY_MAP[isoCode.toUpperCase()] ?? "USD";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, isConfirmed]);

  const detect = async () => {
    try {
      const { status } = await expoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const position = await expoLocation.getCurrentPositionAsync({
        accuracy: expoLocation.Accuracy.Low,
      });

      const [geocode] = await expoLocation.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (!geocode) return;

      const isoCode = geocode.isoCountryCode ?? "US";
      const locale = getLocaleFromIsoCode(isoCode);
      const currency = getCurrencyFromIsoCode(isoCode);

      setDetected({
        country: geocode.country ?? isoCode,
        isoCode,
        city: geocode.city ?? geocode.subregion ?? geocode.region ?? "",
        locale,
        currency,
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
