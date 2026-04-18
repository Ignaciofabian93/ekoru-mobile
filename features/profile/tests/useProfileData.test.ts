// Mock i18next — must come before any imports that use it
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: "3rdParty", init: jest.fn() },
}));

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: {
    use: () => ({ init: jest.fn() }),
    addResourceBundle: jest.fn(),
  },
}));

// Mock expo-router
const mockBack = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
}));

// Mock phone-prefix utilities
jest.mock("@/constants/phonePrefixes", () => ({
  getDialCodeByIso: () => "+56",
  splitPhoneNumber: () => ({ prefix: "+56", number: "912345678" }),
}));

// Mock Apollo mutations
const mockUpdateSeller = jest.fn();
const mockUpdatePersonProfile = jest.fn();
const mockUpdateBusinessProfile = jest.fn();

jest.mock("@apollo/client/react", () => ({
  useMutation: (mutation: unknown) => {
    const gqlStr = String(mutation);
    if (gqlStr.includes("UpdateSeller"))
      return [mockUpdateSeller, { loading: false }];
    if (gqlStr.includes("UpdatePersonProfile"))
      return [mockUpdatePersonProfile, { loading: false }];
    if (gqlStr.includes("UpdateBusinessProfile"))
      return [mockUpdateBusinessProfile, { loading: false }];
    return [jest.fn(), { loading: false }];
  },
}));

// Shared mock seller
const mockSeller = {
  id: "seller-1",
  email: "test@example.com",
  sellerType: "PERSON",
  profile: {
    __typename: "PersonProfile",
    id: "pp-1",
    sellerId: "seller-1",
    firstName: "Jane",
    lastName: "Doe",
    displayName: "JaneDoe",
    bio: "Hello!",
    birthday: "1993-05-01",
    allowExchanges: true,
    personSubscriptionPlan: "FREEMIUM",
  },
  phone: "+56912345678",
  address: "123 Main St",
  country: null,
  region: null,
  city: null,
  county: null,
  website: "https://example.com",
  preferredContactMethod: "EMAIL",
  socialMediaLinks: { instagram: "jane_doe" },
  points: 0,
};

const mockRefreshSeller = jest.fn();

jest.mock("@/store/useAuthStore", () => {
  const mod = {
    __esModule: true,
    default: jest.fn((selector?: (s: unknown) => unknown) => {
      const state = {
        seller: mockSeller,
        refreshSeller: mockRefreshSeller,
      };
      return selector ? selector(state) : state;
    }),
    useSeller: () => mockSeller,
    usePersonProfile: () => mockSeller.profile,
    useBusinessProfile: () => null,
    useProfileImage: () => undefined,
    useCoverImage: () => undefined,
    useInitials: () => "JD",
  };
  return mod;
});

jest.mock("@/store/useLocationStore", () => ({
  useConfirmedLocation: () => ({ isoCode: "CL" }),
}));

import { act, renderHook } from "@testing-library/react-native";
import useProfileData from "../hooks/useProfileData";

describe("useProfileData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateSeller.mockResolvedValue({
      data: {
        updateSeller: { ...mockSeller, website: "https://updated.com" },
      },
    });
    mockUpdatePersonProfile.mockResolvedValue({
      data: {
        updatePersonProfile: {
          ...mockSeller.profile,
          bio: "Updated bio",
        },
      },
    });
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("returns the seller from the store", () => {
    const { result } = renderHook(() => useProfileData());
    expect(result.current.seller).toEqual(mockSeller);
  });

  it("initialises personValues from the person profile", () => {
    const { result } = renderHook(() => useProfileData());
    expect(result.current.personValues.firstName).toBe("Jane");
    expect(result.current.personValues.lastName).toBe("Doe");
    expect(result.current.personValues.bio).toBe("Hello!");
  });

  it("initialises contactValues with parsed phone number", () => {
    const { result } = renderHook(() => useProfileData());
    expect(result.current.contactValues.phone).toBe("912345678");
    expect(result.current.contactValues.phonePrefix).toBe("+56");
  });

  it("isSaving is false initially", () => {
    const { result } = renderHook(() => useProfileData());
    expect(result.current.isSaving).toBe(false);
  });

  // ── handleLocationChange ───────────────────────────────────────────────────

  it("sets countryId and clears region, city, county", () => {
    const { result } = renderHook(() => useProfileData());
    act(() => result.current.handleLocationChange("countryId", 42));
    expect(result.current.locationValues.countryId).toBe(42);
    expect(result.current.locationValues.regionId).toBeNull();
    expect(result.current.locationValues.cityId).toBeNull();
    expect(result.current.locationValues.countyId).toBeNull();
  });

  it("sets regionId and clears city, county", () => {
    const { result } = renderHook(() => useProfileData());
    act(() => {
      result.current.handleLocationChange("countryId", 42);
      result.current.handleLocationChange("regionId", 5);
    });
    expect(result.current.locationValues.regionId).toBe(5);
    expect(result.current.locationValues.cityId).toBeNull();
    expect(result.current.locationValues.countyId).toBeNull();
  });

  it("sets cityId and clears county only", () => {
    const { result } = renderHook(() => useProfileData());
    act(() => {
      result.current.handleLocationChange("countryId", 42);
      result.current.handleLocationChange("regionId", 5);
      result.current.handleLocationChange("cityId", 10);
    });
    expect(result.current.locationValues.cityId).toBe(10);
    expect(result.current.locationValues.countyId).toBeNull();
  });

  // ── Setters ────────────────────────────────────────────────────────────────

  it("setPersonValues merges new values into state", () => {
    const { result } = renderHook(() => useProfileData());
    act(() =>
      result.current.setPersonValues((prev) => ({ ...prev, bio: "New bio" })),
    );
    expect(result.current.personValues.bio).toBe("New bio");
  });

  it("setContactValues merges new values into state", () => {
    const { result } = renderHook(() => useProfileData());
    act(() =>
      result.current.setContactValues((prev) => ({
        ...prev,
        website: "https://new.com",
      })),
    );
    expect(result.current.contactValues.website).toBe("https://new.com");
  });

  // ── handleSave ─────────────────────────────────────────────────────────────

  it("calls UPDATE_SELLER and UPDATE_PERSON_PROFILE on save", async () => {
    const { result } = renderHook(() => useProfileData());
    await act(async () => { await result.current.handleSave(); });
    expect(mockUpdateSeller).toHaveBeenCalled();
    expect(mockUpdatePersonProfile).toHaveBeenCalled();
    expect(mockUpdateBusinessProfile).not.toHaveBeenCalled();
  });

  it("calls refreshSeller with merged data after save", async () => {
    const { result } = renderHook(() => useProfileData());
    await act(async () => { await result.current.handleSave(); });
    expect(mockRefreshSeller).toHaveBeenCalled();
  });
});
