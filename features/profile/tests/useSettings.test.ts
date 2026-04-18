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
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack }),
}));

// Mock toast helpers
const mockShowError = jest.fn();
const mockShowSuccess = jest.fn();
jest.mock("@/lib/toast", () => ({
  showError: (...args: unknown[]) => mockShowError(...args),
  showSuccess: (...args: unknown[]) => mockShowSuccess(...args),
}));

// Mock Apollo mutation
const mockUpdateSellerPreferences = jest.fn();
jest.mock("@apollo/client/react", () => ({
  useMutation: () => [mockUpdateSellerPreferences, { loading: false }],
}));

// Mock auth store
const mockSetBiometricEnabled = jest.fn();
jest.mock("@/store/useAuthStore", () => {
  const actual = jest.requireActual("@/store/useAuthStore");
  return {
    __esModule: true,
    default: jest.fn(() => ({
      seller: { id: "seller-1" },
      setBiometricEnabled: mockSetBiometricEnabled,
    })),
    ...actual,
  };
});

import { act, renderHook } from "@testing-library/react-native";
import useSettings from "../hooks/useSettings";

describe("useSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateSellerPreferences.mockResolvedValue({});
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("initialises with default preferences", () => {
    const { result } = renderHook(() => useSettings());
    const prefs = result.current.sellerPreferences;

    expect(prefs.emailNotifications).toBe(true);
    expect(prefs.pushNotifications).toBe(true);
    expect(prefs.orderUpdates).toBe(true);
    expect(prefs.communityUpdates).toBe(true);
    expect(prefs.securityAlerts).toBe(true);
    expect(prefs.weeklySummary).toBe(true);
    expect(prefs.twoFactorAuth).toBe(false);
  });

  it("exposes loadingPreferences as false initially", () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.loadingPreferences).toBe(false);
  });

  // ── handleSellerPreferences ────────────────────────────────────────────────

  it.each([
    ["emailNotifications", false],
    ["pushNotifications", false],
    ["orderUpdates", false],
    ["twoFactorAuth", true],
  ] as const)(
    "updates '%s' via handleSellerPreferences",
    (preference, value) => {
      const { result } = renderHook(() => useSettings());
      act(() => {
        result.current.handleSellerPreferences({ preference, value });
      });
      expect(result.current.sellerPreferences[preference]).toBe(value);
    },
  );

  it("updates preferredLanguage", () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.handleSellerPreferences({
        preference: "preferredLanguage",
        value: "en",
      });
    });
    expect(result.current.sellerPreferences.preferredLanguage).toBe("en");
  });

  // ── submitSellerPreferences ────────────────────────────────────────────────

  it("calls the mutation with seller id and current preferences", async () => {
    const { result } = renderHook(() => useSettings());

    await act(async () => {
      await result.current.submitSellerPreferences();
    });

    expect(mockUpdateSellerPreferences).toHaveBeenCalledWith({
      variables: {
        input: expect.objectContaining({
          sellerId: "seller-1",
          twoFactorAuth: false,
          emailNotifications: true,
        }),
      },
    });
  });

  it("does not show error toast on successful mutation", async () => {
    const { result } = renderHook(() => useSettings());
    await act(async () => { await result.current.submitSellerPreferences(); });
    expect(mockShowError).not.toHaveBeenCalled();
  });
});
