import { createMMKV } from "react-native-mmkv";

/**
 * General-purpose MMKV storage instance.
 *
 * Storage location (set by MMKV automatically — no custom path needed):
 *   Android → /data/data/<package>/files/mmkv/   (private, OS-sandboxed)
 *   iOS     → <NSDocumentDirectory>/mmkv/         (sandboxed, excluded from iCloud backup)
 *
 * Encryption: AES-256 with a fixed app-scoped key. The key lives in the
 * binary, so it won't stop a determined attacker with full device access,
 * but it protects the raw MMKV files from casual extraction (backups,
 * forensic tools, rooted devices without physical access to RAM).
 * For anything truly sensitive (tokens, credentials) use expo-secure-store,
 * which stores keys in the platform hardware keychain — not here.
 *
 * mode: 'single-process' is the correct default for a standard app with no
 * widgets or share extensions. Set 'multi-process' only if you add those.
 */
export const storage = createMMKV({
  id: "ekoru-app-storage",
  encryptionKey: "ekoru-mmkv-2024-k9x#mP2qLz8@wRnQ",
  encryptionType: "AES-256",
  mode: "single-process",
});

// ─── Generic helpers ──────────────────────────────────────────────────────────

/**
 * Persist a value under `key`. Strings, numbers, and booleans are stored
 * natively. Everything else is JSON-serialised automatically.
 */
export function storageSet<T>(key: string, value: T): void {
  if (typeof value === "string") {
    storage.set(key, value);
  } else if (typeof value === "number") {
    storage.set(key, value);
  } else if (typeof value === "boolean") {
    storage.set(key, value);
  } else {
    storage.set(key, JSON.stringify(value));
  }
}

/**
 * Read a value back from storage.
 *
 * Pass the expected type as the generic parameter so the return is typed:
 *   storageGet<string>("theme")         → string | null
 *   storageGet<number>("badge_count")   → number | null
 *   storageGet<boolean>("onboarded")    → boolean | null
 *   storageGet<MyObject>("draft")       → MyObject | null
 *
 * Returns `null` when the key doesn't exist or parsing fails.
 */
export function storageGet<T>(key: string): T | null {
  if (!storage.contains(key)) return null;

  // Attempt native typed reads first (faster, no JSON overhead)
  const str = storage.getString(key);
  if (str === undefined) {
    // Key holds a number or boolean — read whichever fits
    const num = storage.getNumber(key);
    if (num !== undefined) return num as T;

    const bool = storage.getBoolean(key);
    if (bool !== undefined) return bool as T;

    return null;
  }

  // Try to parse as JSON (handles objects/arrays stored via storageSet)
  try {
    return JSON.parse(str) as T;
  } catch {
    // Plain string — return as-is
    return str as T;
  }
}

/**
 * Delete a single key from storage. Safe to call even if the key is absent.
 */
export function storageDelete(key: string): void {
  storage.remove(key);
}

/**
 * Check whether a key exists in storage.
 */
export function storageHas(key: string): boolean {
  return storage.contains(key);
}
