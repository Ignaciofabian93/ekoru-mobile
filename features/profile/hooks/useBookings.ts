import {
  CANCEL_SERVICE_BOOKING,
  COMPLETE_SERVICE_BOOKING,
  GET_MY_PROVIDER_BOOKINGS,
  GET_MY_SERVICE_BOOKINGS,
  UPDATE_SERVICE_BOOKING_STATUS,
} from "@/graphql/services/bookings";
import { showError } from "@/lib/toast";
import type { Seller } from "@/types/user";
import { useMutation, useQuery } from "@apollo/client/react";

export type BookingStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "NO_SHOW" | "CANCELLED";

export interface ServiceBooking {
  id: string;
  serviceId: number;
  clientId: string;
  providerId: string;
  scheduledDate: string;
  scheduledTimeSlot?: string | null;
  agreedPrice: number;
  status: BookingStatus;
  /** Always ON_SITE for the beta: paid to the provider, not through EKORU (D7). */
  paymentMode: "ON_SITE";
  clientNotes?: string | null;
  providerNotes?: string | null;
  cancellationReason?: string | null;
  completedAt?: string | null;
  createdAt: string;
  service?: { id: string; name: string; displayImage?: string | null; sellerId: string } | null;
  /** Who booked; on received bookings only. */
  client?: Pick<Seller, "id" | "profile"> | null;
}

/** Moves the provider may make, by current status (services' booking-rules.ts, as on the web). */
export type ProviderMove = "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "NO_SHOW";

export const PROVIDER_MOVES: Partial<Record<BookingStatus, ProviderMove[]>> = {
  PENDING: ["CONFIRMED"],
  CONFIRMED: ["IN_PROGRESS", "COMPLETED", "NO_SHOW"],
  IN_PROGRESS: ["COMPLETED", "NO_SHOW"],
};

/** A booking can still be cancelled while nothing has happened yet. */
export const CANCELLABLE: BookingStatus[] = ["PENDING", "CONFIRMED"];

interface Connection<T> {
  nodes: T[];
}

async function attempt(fn: () => Promise<unknown>, title: string): Promise<boolean> {
  try {
    await fn();
    return true;
  } catch (error) {
    showError({ title, message: error instanceof Error ? error.message : "" });
    return false;
  }
}

/**
 * Both sides of service bookings (MOB-3). A seller can be a client on some and
 * the provider on others, so both lists load and the screen splits them into
 * tabs. Every mutation refetches both.
 */
export function useBookings({ errorTitle }: { errorTitle: string }) {
  const made = useQuery<{ myServiceBookings: Connection<ServiceBooking> }>(GET_MY_SERVICE_BOOKINGS, {
    fetchPolicy: "cache-and-network",
  });
  const received = useQuery<{ myProviderBookings: Connection<ServiceBooking> }>(GET_MY_PROVIDER_BOOKINGS, {
    fetchPolicy: "cache-and-network",
  });
  const refetchQueries = [{ query: GET_MY_SERVICE_BOOKINGS }, { query: GET_MY_PROVIDER_BOOKINGS }];
  const [updateStatus, s1] = useMutation(UPDATE_SERVICE_BOOKING_STATUS, { refetchQueries });
  const [completeBooking, s2] = useMutation(COMPLETE_SERVICE_BOOKING, { refetchQueries });
  const [cancelBooking, s3] = useMutation(CANCEL_SERVICE_BOOKING, { refetchQueries });

  return {
    made: made.data?.myServiceBookings.nodes ?? [],
    received: received.data?.myProviderBookings.nodes ?? [],
    loading: (made.loading && !made.data) || (received.loading && !received.data),
    refreshing: made.loading || received.loading,
    refetch: () => Promise.all([made.refetch(), received.refetch()]),
    busy: s1.loading || s2.loading || s3.loading,
    move: (id: string, to: ProviderMove) =>
      attempt(
        () =>
          to === "COMPLETED"
            ? completeBooking({ variables: { id } })
            : updateStatus({ variables: { id, status: to } }),
        errorTitle,
      ),
    cancel: (id: string, reason: string) =>
      attempt(() => cancelBooking({ variables: { id, reason } }), errorTitle),
  };
}
