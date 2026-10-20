import { earliestBookingDate } from "../utils/booking";

describe("earliestBookingDate", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 9, 20, 15, 30));
  });
  afterEach(() => jest.useRealTimers());

  it("is today at midnight when the provider needs no notice", () => {
    expect(earliestBookingDate(null)).toEqual(new Date(2026, 9, 20));
    expect(earliestBookingDate(0)).toEqual(new Date(2026, 9, 20));
  });

  it("moves forward by the provider's advance-booking days", () => {
    expect(earliestBookingDate(3)).toEqual(new Date(2026, 9, 23));
    expect(earliestBookingDate(15)).toEqual(new Date(2026, 10, 4));
  });
});
