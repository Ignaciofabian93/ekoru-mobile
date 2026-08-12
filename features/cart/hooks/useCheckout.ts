import { GATEWAY_BASE_URL } from "@/config/endpoints";
import { CREATE_ORDER, CREATE_PAYMENT } from "@/graphql/checkout/mutations";
import useAppRouter from "@/hooks/useAppRouter";
import { logger } from "@/lib/logger";
import { showError } from "@/lib/toast";
import useCartStore from "@/store/useCartStore";
import type {
  CreateOrderInput,
  CreateOrderResponse,
  CreatePaymentInput,
  CreatePaymentResponse,
  PaymentProviderId,
  ShippingAddressInput,
  ShippingMethod,
} from "@/types/checkout";
import { useMutation } from "@apollo/client/react";
import * as WebBrowser from "expo-web-browser";
import { useMemo, useState } from "react";

import {
  HOME_DELIVERY_FLAT_RATE_CLP,
  shippingMethodById,
} from "../constants/shippingMethods";

export type CheckoutStep = "shipping" | "payment" | "review";

const STEP_ORDER: CheckoutStep[] = ["shipping", "payment", "review"];

/**
 * Drives the mobile checkout: collect shipping and provider, create the order,
 * create the payment, hand off to the provider, come back.
 *
 * Mirrors `ekoru-web-app/features/cart/hooks/useCheckout.ts` — same mutations,
 * same validation — but the hand-off differs. The web can build a Webpay
 * form-POST in the DOM and navigate away; a native app can only open a URL and
 * cannot observe what happens inside the browser. So the app opens the provider
 * in a system browser, and once that closes it hands the `paymentId` to the
 * confirmation screen, which asks the backend what actually happened. Nothing
 * here treats "browser closed" as "paid".
 */
export default function useCheckout() {
  const { items, subtotal } = useCartStore();
  const { replace } = useAppRouter();

  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [address, setAddress] = useState<Partial<ShippingAddressInput>>({});
  const [provider, setProvider] = useState<PaymentProviderId | null>(null);
  const [loading, setLoading] = useState(false);

  const [createOrder] = useMutation<
    { createOrder: CreateOrderResponse },
    { input: CreateOrderInput }
  >(CREATE_ORDER);
  const [createPayment] = useMutation<
    { createPayment: CreatePaymentResponse },
    { input: CreatePaymentInput }
  >(CREATE_PAYMENT);

  // The backend rejects an order spanning two sellers (one order = one seller,
  // see docs/CHECKOUT.md §5). Catch it here so the buyer is told before paying
  // rather than by a mutation error afterwards.
  const sellerIds = useMemo(
    () => Array.from(new Set(items.map((i) => i.product.sellerId).filter(Boolean))),
    [items],
  );
  const hasMultipleSellers = sellerIds.length > 1;

  const shippingCost = useMemo(() => {
    if (!shippingMethod) return 0;
    const meta = shippingMethodById(shippingMethod);
    if (!meta.payable || !meta.requiresAddress) return 0;
    // CARRIER has no live quote yet (EK-9), so it is blocked in `isShippingValid`
    // rather than silently charged the home-delivery rate.
    return meta.isQuoted ? 0 : HOME_DELIVERY_FLAT_RATE_CLP;
  }, [shippingMethod]);

  const cartSubtotal = subtotal();
  const total = cartSubtotal + shippingCost;

  const isShippingValid = useMemo(() => {
    if (!shippingMethod) return false;
    const meta = shippingMethodById(shippingMethod);
    if (!meta.payable) return false;
    if (meta.isQuoted) return false;
    if (!meta.requiresAddress) return true;
    return Boolean(
      address.recipientName &&
        address.countryId &&
        address.regionId &&
        address.cityId &&
        address.countyId &&
        address.street &&
        address.phone,
    );
  }, [shippingMethod, address]);

  const isPaymentValid = Boolean(provider);

  const updateAddressField = <K extends keyof ShippingAddressInput>(
    key: K,
    value: ShippingAddressInput[K] | undefined,
  ) => setAddress((prev) => ({ ...prev, [key]: value }));

  const stepError = (): string | null => {
    if (step === "shipping") {
      if (!shippingMethod) return "Elige un método de entrega";
      const meta = shippingMethodById(shippingMethod);
      if (!meta.payable) return "El punto intermedio se coordina por mensaje, no se paga aquí";
      if (meta.isQuoted) return "El envío por courier aún no está disponible";
      if (!isShippingValid) return "Completa los datos de entrega";
    }
    if (step === "payment" && !isPaymentValid) return "Elige un medio de pago";
    return null;
  };

  const goNext = () => {
    const error = stepError();
    if (error) {
      showError({ title: "Falta información", message: error });
      return;
    }
    const idx = STEP_ORDER.indexOf(step);
    setStep(STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]);
  };

  const goBack = () => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
  };

  const pay = async () => {
    if (items.length === 0) return;
    if (hasMultipleSellers) {
      showError({
        title: "Carro con varios vendedores",
        message: "Deja productos de un solo vendedor para pagar. Podrás comprar el resto después.",
      });
      return;
    }
    const error = !shippingMethod
      ? "Elige un método de entrega"
      : !isShippingValid
        ? "Completa los datos de entrega"
        : !provider
          ? "Elige un medio de pago"
          : null;
    if (error || !shippingMethod || !provider) {
      showError({ title: "Falta información", message: error ?? "Revisa los datos" });
      return;
    }

    const meta = shippingMethodById(shippingMethod);
    setLoading(true);
    try {
      const orderRes = await createOrder({
        variables: {
          input: {
            // Mobile's cart only holds marketplace products, so every line maps
            // to productId (store products would use storeProductId).
            items: items.map((i) => ({
              productId: Number(i.product.id),
              quantity: i.quantity,
            })),
            shippingMethod,
            shippingAddress: meta.requiresAddress
              ? (address as ShippingAddressInput)
              : undefined,
            currency: "CLP",
          },
        },
      });
      const order = orderRes.data?.createOrder;
      if (!order) throw new Error("createOrder no devolvió datos");

      // The provider returns the buyer to the gateway, which commits the payment
      // and then redirects on to the web confirmation page. That page is the end
      // of the browser journey; the app reads the result over the API.
      const returnUrl = `${GATEWAY_BASE_URL}/payments/return/${provider.toLowerCase()}`;

      const paymentRes = await createPayment({
        variables: {
          input: { orderId: Number(order.id), provider, returnUrl },
        },
      });
      const payment = paymentRes.data?.createPayment;
      if (!payment) throw new Error("createPayment no devolvió datos");

      // Webpay only accepts an HTTP form-POST with the token, which a browser
      // tab cannot be opened onto directly — the gateway serves a tiny page that
      // performs the POST. Khipu and MercadoPago take a plain URL.
      const handoffUrl =
        payment.redirect.kind === "WEBPAY_FORM"
          ? `${GATEWAY_BASE_URL}/payments/webpay/redirect?url=${encodeURIComponent(
              payment.redirect.url,
            )}&token=${encodeURIComponent(payment.redirect.token)}`
          : payment.redirect.url;

      await WebBrowser.openBrowserAsync(handoffUrl, { showTitle: true });

      // Whatever the buyer did in there, the confirmation screen is what decides:
      // it polls the payment until the backend reports a final state.
      replace({
        pathname: "/(cart)/confirmation",
        params: { paymentId: payment.paymentId, orderId: String(order.id) },
      });
    } catch (err) {
      logger.error("[Checkout] payment failed:", err);
      showError({
        title: "No pudimos procesar el pago",
        message: err instanceof Error ? err.message : "Inténtalo nuevamente en unos minutos",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    goNext,
    goBack,

    items,
    subtotal: cartSubtotal,
    shippingCost,
    total,
    currency: "CLP",

    shippingMethod,
    setShippingMethod,
    address,
    updateAddressField,

    provider,
    setProvider,

    hasMultipleSellers,
    isShippingValid,
    isPaymentValid,
    loading,
    pay,
  };
}
