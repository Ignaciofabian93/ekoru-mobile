import { ADD_SERVICE_BOOKING, GET_MY_SERVICE_BOOKINGS } from "@/graphql/services/bookings";
import { showError } from "@/lib/toast";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NAMESPACE } from "../i18n";

export interface BookingDraft {
  /** `YYYY-MM-DD` from the date picker. */
  date: string;
  /** Free text, e.g. "10:00 – 12:00". Optional. */
  timeSlot: string;
  notes: string;
}

const emptyDraft: BookingDraft = { date: "", timeSlot: "", notes: "" };

/**
 * Books a service for the signed-in buyer, the same request as the web's
 * booking dialog (WEB-5). It is paid to the provider on site (D7); the provider
 * confirms it from their bookings. Quote-priced services are not booked: they
 * wait for quote requests (WEB-4).
 */
export default function useBookService(serviceId: string) {
  const { t } = useTranslation(NAMESPACE);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [done, setDone] = useState(false);
  const [addBooking, { loading }] = useMutation(ADD_SERVICE_BOOKING, {
    refetchQueries: [{ query: GET_MY_SERVICE_BOOKINGS }],
  });

  const update = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    if (!draft.date) {
      showError({ title: t("detail.booking.errors.missingDate") });
      return;
    }
    try {
      await addBooking({
        variables: {
          input: {
            serviceId: Number(serviceId),
            // Noon local time: a bare date would be read as UTC midnight and
            // can land on the previous day in Chile.
            scheduledDate: new Date(`${draft.date}T12:00:00`).toISOString(),
            scheduledTimeSlot: draft.timeSlot.trim() || undefined,
            clientNotes: draft.notes.trim() || undefined,
          },
        },
      });
      setDone(true);
    } catch (error) {
      showError({
        title: t("detail.booking.errors.failed"),
        message: error instanceof Error ? error.message : "",
      });
    }
  };

  const reset = () => {
    setDraft(emptyDraft);
    setDone(false);
  };

  return { draft, update, isValid: draft.date.length > 0, loading, done, submit, reset };
}
