import { DUMMY_STORES } from "../data/dummyStores";
import type { Store } from "../types/Store";

export default function useStores(): {
  stores: Store[];
  loading: boolean;
  error: null;
} {
  return { stores: DUMMY_STORES, loading: false, error: null };
}
