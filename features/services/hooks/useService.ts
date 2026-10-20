import { GET_SERVICE_BY_ID } from "@/graphql/services/queries";
import type { ServicePricing } from "@/types/enums";
import type { Seller } from "@/types/user";
import { useQuery } from "@apollo/client/react";

/**
 * What the service screen reads from `getService` (`ServiceDetailFields`).
 * Most operational fields are nullable: a provider can publish before filling
 * in scheduling or coverage, and the screen skips the rows it has no value for.
 */
export interface ServiceDetail {
  id: string;
  name: string;
  description: string | null;
  sellerId: string;
  pricingType: ServicePricing | null;
  basePrice: number | null;
  /** Minutes, stored as a string by the subgraph. */
  duration: string | null;
  images: string[] | null;
  /** Own first photo, or the provider's logo when the service has none. */
  displayImage?: string | null;
  isActive: boolean | null;
  isCurrentlyAvailable: boolean | null;
  advanceBookingDays: number | null;
  /** Kilometres the provider travels. */
  serviceRadius: number | null;
  serviceLocations: string[] | null;
  isRemoteService: boolean | null;
  averageRating: number | null;
  reviewCount: number | null;
  seller: Seller | null;
  serviceCategory: { subCategory: string | null } | null;
}

export default function useService(id: string) {
  const { data, loading } = useQuery<{ getService: ServiceDetail | null }>(GET_SERVICE_BY_ID, {
    variables: { id },
    skip: !id,
  });
  return { service: data?.getService ?? null, loading };
}
