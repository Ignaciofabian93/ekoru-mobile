export type Country = {
  id: number;
  country: string;
  countryConfig?: CountryConfig;
};

export type Region = {
  id: number;
  region: string;
  countryId: number;
};

export type City = {
  id: number;
  city: string;
  regionId: number;
};

export type County = {
  id: number;
  county: string;
  cityId: number;
};

export type CountryConfig = {
  id: number;
  countryId: number;
  countryCode: string;
  currencyCode: string;
  currencySymbol: string;
  taxIdLabel: string;
  taxIdFormat?: string;
  defaultTimezone: string;
  defaultLocale: string;
  isActive: boolean;
  phonePrefix: string;
  availablePaymentProviders: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
