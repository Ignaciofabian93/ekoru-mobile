import { GATEWAY_BASE_URL } from "@/config/endpoints";
import type { ExternalRedirect, PaymentProviderId, WebpayRedirect } from "@/types/checkout";
import * as WebBrowser from "expo-web-browser";

/**
 * Where the provider sends the buyer back: the gateway, which commits the
 * payment and then lands the browser on the web's confirmation page. The path
 * names the provider, so it must match the one the payment was started with.
 */
export const paymentReturnUrl = (provider: PaymentProviderId): string =>
  `${GATEWAY_BASE_URL}/payments/return/${provider.toLowerCase()}`;

/**
 * Opens the provider in a system browser and resolves when the buyer closes
 * it. The app can't see what happened in there, so callers ask the API for
 * the payment's state afterwards; a closed browser never means "paid".
 *
 * Webpay only takes a form POST with its token, which a browser can't be
 * opened onto, so the gateway serves a page that performs it. Mercado Pago and
 * Khipu take a plain URL.
 */
export async function openPaymentHandoff(redirect: WebpayRedirect | ExternalRedirect): Promise<void> {
  const url =
    redirect.kind === "WEBPAY_FORM"
      ? `${GATEWAY_BASE_URL}/payments/webpay/redirect?url=${encodeURIComponent(
          redirect.url,
        )}&token=${encodeURIComponent(redirect.token)}`
      : redirect.url;
  await WebBrowser.openBrowserAsync(url, { showTitle: true });
}
