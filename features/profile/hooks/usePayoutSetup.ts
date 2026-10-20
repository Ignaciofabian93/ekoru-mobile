import { WEB_APP_BASE_URL } from "@/config/endpoints";
import { MY_STORE_PAYMENT_SETUP } from "@/graphql/payoutSetup/queries";
import { useHasSellerType } from "@/store/useAuthStore";
import { useQuery } from "@apollo/client/react";
import * as WebBrowser from "expo-web-browser";

export type StorePaymentSetup = {
  connected: boolean;
  needsReconnect: boolean;
  accountId: string | null;
  environment: "SANDBOX" | "PRODUCTION" | null;
  connectedAt: string | null;
  tokenExpiresAt: string | null;
  /** EKORU's commission as a fraction (0.05 = 5%). */
  commissionRate: number;
};

/**
 * A business's Mercado Pago connection (MOB-6). Mercado Pago only returns to a
 * registered web address, so connecting happens on the web's Cobros page,
 * opened in the browser; the status is read again when the browser closes.
 */
export function usePayoutSetup() {
  const isBusiness = useHasSellerType("STARTUP", "COMPANY");
  const { data, loading, refetch } = useQuery<{ myStorePaymentSetup: StorePaymentSetup }>(
    MY_STORE_PAYMENT_SETUP,
    { skip: !isBusiness, fetchPolicy: "cache-and-network" },
  );

  const openOnWeb = async () => {
    await WebBrowser.openBrowserAsync(`${WEB_APP_BASE_URL}/profile/payments`, { showTitle: true });
    await refetch();
  };

  return {
    isBusiness,
    setup: data?.myStorePaymentSetup ?? null,
    loading: loading && !data,
    openOnWeb,
  };
}
