export const CURRENCIES_SUPPORTED = [
  "ARS",
  "BOB",
  "BRL",
  "CAD",
  "CLP",
  "COP",
  "EUR",
  "GBP",
  "MXN",
  "PEN",
  "PYG",
  "USD",
  "UYU",
  "VES",
] as const;

export type Currency = (typeof CURRENCIES_SUPPORTED)[number];
