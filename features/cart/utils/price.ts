interface Priced {
  price: number;
  hasOffer?: boolean;
  offerPrice?: number | null;
}

/** The offer price when there is one, as the web charges it. */
export const unitPriceOf = (p: Priced): number =>
  p.hasOffer && typeof p.offerPrice === "number" && p.offerPrice > 0 ? p.offerPrice : p.price;
