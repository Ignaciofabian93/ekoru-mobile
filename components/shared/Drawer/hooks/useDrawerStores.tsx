import { GET_STORES_CATALOG } from "@/graphql/stores/queries";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Mirrors the StoreCatalogItem / StoreSubCategoryItem GraphQL types
type StoreSubCategoryItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

type StoreCatalogItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: StoreSubCategoryItem[];
};

type L2Item = { label: string; route: string };
export type L1Item = { label: string; route: string; children?: L2Item[] };

// Maps the catalog response into the L1 > L2 accordion structure:
//   StoreCatalogItem > StoreSubCategoryItem
function mapCatalogToAccordion(items: StoreCatalogItem[]): L1Item[] {
  return items.map((cat) => ({
    label: cat.name,
    route: `/(tabs)/stores?cat=${cat.slug}`,
    children: cat.subCategoryItems.map((sub) => ({
      label: sub.name,
      route: `/(tabs)/stores?sub=${sub.slug}`,
    })),
  }));
}

// `enabled` should be false until the drawer has been opened at least once.
// This prevents firing a network request on app startup since the Drawer is
// always mounted in the layout tree even when hidden.
export function useDrawerStores(enabled: boolean) {
  const { i18n } = useTranslation();
  const language = (i18n.language?.toUpperCase() ?? "ES") as "ES" | "EN" | "FR";

  const { data } = useQuery<{ getStoreCatalog: StoreCatalogItem[] }>(
    GET_STORES_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  // Memoize the mapped result so the array reference is stable between renders.
  // mapCatalogToAccordion is only re-run when the raw API data actually changes.
  const items = useMemo<L1Item[]>(
    () =>
      data?.getStoreCatalog ? mapCatalogToAccordion(data.getStoreCatalog) : [],
     
    [data?.getStoreCatalog],
  );

  return { items };
}
