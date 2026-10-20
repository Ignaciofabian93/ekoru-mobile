/** Earliest date the provider accepts, honouring their advance-booking window. */
export function earliestBookingDate(advanceBookingDays: number | null | undefined): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + (advanceBookingDays ?? 0));
  return date;
}
