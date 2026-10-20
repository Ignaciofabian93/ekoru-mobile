import { GET_MY_ORDERS } from "@/graphql/checkout/queries";
import { useQuery } from "@apollo/client/react";
import type { BuyerOrder } from "../utils/orders";

interface OrdersResponse {
  getOrdersByBuyer: { nodes: BuyerOrder[]; pageInfo: { totalCount: number } };
}

/**
 * The buyer's orders (MOB-3), replacing the mock list. One page of the latest
 * 30 is enough while store purchases are off (WEB-3); paging can follow.
 */
export default function useMyOrders() {
  const { data, loading, error, refetch } = useQuery<OrdersResponse>(GET_MY_ORDERS, {
    variables: { page: 1, pageSize: 30 },
    // Reachable straight after checkout, so a cached page must not hide a new order.
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });
  return {
    orders: data?.getOrdersByBuyer.nodes ?? [],
    initialLoading: loading && !data,
    refreshing: loading && Boolean(data),
    error,
    refetch,
  };
}
