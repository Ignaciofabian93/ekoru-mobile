import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GET_SERVICES_CATALOG } from "@/graphql/services/queries";

type ServiceSubCategoryItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
};

type ServiceCatalogItem = {
  id: number;
  name: string;
  slug: string;
  href: string;
  subCategoryItems: ServiceSubCategoryItem[];
};

type L2Item = { label: string; route: string };
export type L1Item = { label: string; route: string; children?: L2Item[] };

// Maps the catalog response into the L1 > L2 accordion structure:
//   ServiceCatalogItem > ServiceSubCategoryItem
function mapCatalogToAccordion(items: ServiceCatalogItem[]): L1Item[] {
  return items.map((cat) => ({
    label: cat.name,
    route: `/(tabs)/services?cat=${cat.slug}`,
    children: cat.subCategoryItems.map((sub) => ({
      label: sub.name,
      route: `/(tabs)/services?sub=${sub.slug}`,
    })),
  }));
}

// `enabled` should be false until the drawer has been opened at least once.
export function useDrawerServices(enabled: boolean) {
  const { i18n } = useTranslation();
  const language = (i18n.language?.toUpperCase() ?? "ES") as "ES" | "EN" | "FR";

  const { data } = useQuery<{ getServicesCatalog: ServiceCatalogItem[] }>(
    GET_SERVICES_CATALOG,
    {
      variables: { language },
      fetchPolicy: "cache-first",
      skip: !enabled,
    },
  );

  const items = useMemo<L1Item[]>(
    () =>
      data?.getServicesCatalog
        ? mapCatalogToAccordion(data.getServicesCatalog)
        : [],
     
    [data?.getServicesCatalog],
  );

  return { items };
}
