import { CURRENCY_STORAGE_KEY } from "@/constants/locale";
import { storageGet } from "@/lib/storage";
import { CURRENCIES_SUPPORTED, type Currency } from "@/config/currencies";

export default function useStoredCurrency(): Currency | undefined {
  const stored = storageGet<string>(CURRENCY_STORAGE_KEY);
  if (stored && (CURRENCIES_SUPPORTED as readonly string[]).includes(stored)) return stored as Currency;
}
