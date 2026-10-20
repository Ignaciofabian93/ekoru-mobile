import { gql } from "@apollo/client";

// The signed-in business's Mercado Pago connection (ekoru-transactions
// MercadoPagoConnectResolver). Never carries a token.
export const MY_STORE_PAYMENT_SETUP = gql`
  query MyStorePaymentSetup {
    myStorePaymentSetup {
      provider
      connected
      needsReconnect
      accountId
      environment
      connectedAt
      tokenExpiresAt
      commissionRate
    }
  }
`;
