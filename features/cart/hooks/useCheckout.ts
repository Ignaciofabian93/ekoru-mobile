import { CREATE_ORDER, CREATE_PAYMENT } from "@/graphql/checkout/mutations";
import useAppRouter from "@/hooks/useAppRouter";
import { logger } from "@/lib/logger";
import { showError } from "@/lib/toast";
import { useCartGroups } from "@/store/useCartStore";
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
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";

import {
  HOME_DELIVERY_FLAT_RATE_CLP,
  shippingMethodById,
  PAYMENT_PROVIDERS,
} from "../constants/shippingMethods";
import { openPaymentHandoff, paymentReturnUrl } from "../utils/paymentHandoff";

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
 *
 * One order is one seller, so checkout runs one cart group at a time: the
 * cart's per-seller "Pagar" passes `?g=<group id>`. A missing or stale group
 * falls back to the first one, so checkout never dead-ends.
 */
export default function useCheckout() {
  const groups = useCartGroups();
  const { g } = useLocalSearchParams<{ g?: string }>();
  const group = useMemo(
    () => (g ? (groups.find((x) => x.id === g) ?? groups[0]) : groups[0]) ?? null,
    [groups, g],
  );
  const items = useMemo(() => group?.items ?? [], [group]);
  const { replace } = useAppRouter();

  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [address, setAddress] = useState<Partial<ShippingAddressInput>>({});
  // With a single provider on offer (Mercado Pago today) it is chosen for the buyer.
  const [provider, setProvider] = useState<PaymentProviderId | null>(
    PAYMENT_PROVIDERS.length === 1 ? PAYMENT_PROVIDERS[0].id : null,
  );
  const [loading, setLoading] = useState(false);

  const [createOrder] = useMutation<{ createOrder: CreateOrderResponse }, { input: CreateOrderInput }>(
    CREATE_ORDER,
  );
  const [createPayment] = useMutation<
    { createPayment: CreatePaymentResponse },
    { input: CreatePaymentInput }
  >(CREATE_PAYMENT);

  const shippingCost = useMemo(() => {
    if (!shippingMethod) return 0;
    const meta = shippingMethodById(shippingMethod);
    if (!meta.payable || !meta.requiresAddress) return 0;
    // CARRIER has no live quote yet (EK-9), so it is blocked in `isShippingValid`
    // rather than silently charged the home-delivery rate.
    return meta.isQuoted ? 0 : HOME_DELIVERY_FLAT_RATE_CLP;
  }, [shippingMethod]);

  const cartSubtotal = group?.subtotal ?? 0;
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
    if (!group || items.length === 0) return;
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
            // A group is single-source, so each line takes the id field its
            // catalogue's subgraph expects.
            items: items.map((i) =>
              i.source === "store"
                ? { storeProductId: i.productId, quantity: i.quantity }
                : { productId: i.productId, quantity: i.quantity },
            ),
            shippingMethod,
            shippingAddress: meta.requiresAddress ? (address as ShippingAddressInput) : undefined,
            currency: "CLP",
          },
        },
      });
      const order = orderRes.data?.createOrder;
      if (!order) throw new Error("createOrder no devolvió datos");

      const paymentRes = await createPayment({
        variables: {
          input: { orderId: Number(order.id), provider, returnUrl: paymentReturnUrl(provider) },
        },
      });
      const payment = paymentRes.data?.createPayment;
      if (!payment) throw new Error("createPayment no devolvió datos");

      await openPaymentHandoff(payment.redirect);

      // Whatever the buyer did in there, the confirmation screen is what decides:
      // it polls the payment until the backend reports a final state, and only
      // then drops this seller's lines from the cart.
      replace({
        pathname: "/(cart)/confirmation",
        params: { paymentId: payment.paymentId, orderId: String(order.id), group: group.id },
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

    group,
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

    isShippingValid,
    isPaymentValid,
    loading,
    pay,
  };
}
