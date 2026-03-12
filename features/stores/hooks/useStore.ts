import { DUMMY_STORES } from "../data/dummyStores";
import type { Store } from "../types/Store";

export default function useStore(id: string): {
  store: Store | null;
  loading: boolean;
  error: null;
} {
  const store = DUMMY_STORES.find((s) => s.id === id) ?? null;
  return { store, loading: false, error: null };
}
