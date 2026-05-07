export interface Plan {
  id?: string;
  key: string;
  label: string;
  price: number;
  period: string;
  currency?: string;
  durationMonths?: number;
  features: string[];
  highlighted?: boolean;
}
