import { UPDATE_SHIPPING } from "@/graphql/checkout/mutations";
import { GET_MY_SALES, GET_SALES_STATS } from "@/graphql/checkout/queries";
import { GET_CITIES_BY_REGION, GET_COUNTIES_BY_CITY, GET_REGIONS_BY_COUNTRY } from "@/graphql/location/queries";
import { showError } from "@/lib/toast";
import type { Seller } from "@/types/user";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import type { BuyerOrder } from "../utils/orders";

/** The address an order ships to. Location fields are ids; see `useAddressNames`. */
export interface SaleAddress {
  id: string;
  recipientName: string;
  phone: string;
  countryId: number;
  regionId: number;
  cityId: number;
  countyId: number;
  street: string;
  reference?: string | null;
  zipCode?: string | null;
}

/** An order the signed-in seller received: the buyer's view plus who and where. */
export interface SaleOrder extends BuyerOrder {
  shippingAddress?: SaleAddress | null;
  buyer?: Pick<Seller, "id" | "email" | "phone" | "profile"> | null;
}

/** The web's filters (WEB-1). "toShip" is what a seller acts on: paid and still being prepared. */
export type SalesFilter = "toShip" | "shipped" | "delivered" | "pending" | "canceled" | "all";

export const SALES_FILTERS: Record<SalesFilter, { status?: string; stage?: string }> = {
  toShip: { status: "PAID", stage: "PREPARING" },
  shipped: { status: "PAID", stage: "SHIPPED" },
  delivered: { status: "PAID", stage: "DELIVERED" },
  pending: { status: "PENDING_PAYMENT" },
  canceled: { status: "CANCELED" },
  all: {},
};

const PAGE_SIZE = 20;

interface SalesResponse {
  getOrdersBySeller: { nodes: SaleOrder[]; pageInfo: { totalCount: number; hasNextPage: boolean } };
}

interface StatsResponse {
  getSellerRevenueStats: { totalRevenue: number; completedCount: number; pendingCount: number };
  toShip: { pageInfo: { totalCount: number } };
}

/** Midnight on the first day of the current month, local time. */
function startOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

/**
 * A store's sales area (MOB-3), the web's "Mis ventas" (WEB-1, WEB-14): the
 * orders it received under a filter, this month's totals, and moving a paid
 * order to shipped (with a tracking note) or delivered. The buyer is told at
 * each step by transactions, which also enforces the moves.
 */
export function useSales({ errorTitle }: { errorTitle: string }) {
  const [filter, setFilterState] = useState<SalesFilter>("toShip");
  const [limit, setLimit] = useState(PAGE_SIZE);
  // Fixed while the screen is open, so the stats keep one cache key.
  const [monthStart] = useState(startOfMonth);

  const sales = useQuery<SalesResponse>(GET_MY_SALES, {
    variables: { page: 1, pageSize: limit, ...SALES_FILTERS[filter] },
    // A sale lands the moment a buyer pays, so a cached page must not hide it.
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  const stats = useQuery<StatsResponse>(GET_SALES_STATS, {
    variables: { dateFrom: monthStart },
    fetchPolicy: "cache-and-network",
  });
  const [updateShipping, { loading: moving }] = useMutation(UPDATE_SHIPPING, {
    // The order may leave the filter ("to ship" → "shipped"), and the count moves with it.
    refetchQueries: ["GetMySales", "GetSalesStats"],
    awaitRefetchQueries: true,
  });

  const moveTo = async (orderId: string, stage: "SHIPPED" | "DELIVERED", trackingInfo?: string) => {
    try {
      await updateShipping({
        variables: {
          input: {
            orderId,
            stage,
            ...(stage === "SHIPPED" && trackingInfo?.trim() ? { trackingInfo: trackingInfo.trim() } : {}),
          },
        },
      });
      return true;
    } catch (error) {
      showError({ title: errorTitle, message: error instanceof Error ? error.message : "" });
      return false;
    }
  };

  const revenue = stats.data?.getSellerRevenueStats;
  return {
    orders: sales.data?.getOrdersBySeller.nodes ?? [],
    hasMore: sales.data?.getOrdersBySeller.pageInfo.hasNextPage ?? false,
    showMore: () => setLimit((n) => n + PAGE_SIZE),
    filter,
    setFilter: (next: SalesFilter) => {
      setFilterState(next);
      setLimit(PAGE_SIZE);
    },
    initialLoading: sales.loading && !sales.data,
    refreshing: sales.loading && Boolean(sales.data),
    error: sales.error,
    refetch: () => Promise.all([sales.refetch(), stats.refetch()]),
    stats: revenue
      ? {
          revenue: revenue.totalRevenue,
          paidCount: revenue.completedCount,
          toShip: stats.data?.toShip.pageInfo.totalCount ?? 0,
        }
      : null,
    moveTo,
    moving,
  };
}

/**
 * Names for an order address, which transactions keeps as location ids. The
 * same lists the checkout address form loads, so they are usually cached.
 * Skipped until the address is shown.
 */
export function useAddressNames(address: SaleAddress | null | undefined, enabled: boolean) {
  const skip = !enabled || !address;
  const regions = useQuery<{ regionsByCountryId: { id: number; region: string }[] }>(GET_REGIONS_BY_COUNTRY, {
    variables: { countryId: address?.countryId },
    skip,
  });
  const cities = useQuery<{ citiesByRegionId: { id: number; city: string }[] }>(GET_CITIES_BY_REGION, {
    variables: { regionId: address?.regionId },
    skip,
  });
  const counties = useQuery<{ countiesByCityId: { id: number; county: string }[] }>(GET_COUNTIES_BY_CITY, {
    variables: { cityId: address?.cityId },
    skip,
  });
  if (!address) return [];
  return [
    counties.data?.countiesByCityId.find((c) => c.id === address.countyId)?.county,
    cities.data?.citiesByRegionId.find((c) => c.id === address.cityId)?.city,
    regions.data?.regionsByCountryId.find((r) => r.id === address.regionId)?.region,
  ].filter((name): name is string => Boolean(name));
}
