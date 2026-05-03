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

// Mock biometric hook
const mockAuthenticate = jest.fn();
jest.mock("@/hooks/useBiometricAuth", () => ({
  __esModule: true,
  default: () => ({
    isAvailable: true,
    supportedTypes: ["fingerprint"],
    authenticate: mockAuthenticate,
  }),
}));

// Mock auth store
const mockSetBiometricEnabled = jest.fn();
let mockBiometricEnabled = false;
jest.mock("@/store/useAuthStore", () => ({
  __esModule: true,
  default: jest.fn((selector?: (s: unknown) => unknown) => {
    const state = {
      seller: { id: "seller-1" },
      biometricEnabled: mockBiometricEnabled,
      setBiometricEnabled: mockSetBiometricEnabled,
    };
    return selector ? selector(state) : state;
  }),
}));

import { act, renderHook } from "@testing-library/react-native";
import useTwoFactorAuth from "../hooks/useTwoFactorAuth";

describe("useTwoFactorAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBiometricEnabled = false;
    mockUpdateSellerPreferences.mockResolvedValue({});
    mockAuthenticate.mockResolvedValue(true);
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("initialises isEnabled from the auth store biometricEnabled value", () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    expect(result.current.isEnabled).toBe(false);
  });

  it("exposes isAvailable from the biometric hook", () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    expect(result.current.isAvailable).toBe(true);
  });

  it("exposes supportedTypes from the biometric hook", () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    expect(result.current.supportedTypes).toEqual(["fingerprint"]);
  });

  // ── Enabling 2FA ──────────────────────────────────────────────────────────

  it("prompts biometrics when enabling 2FA", async () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockAuthenticate).toHaveBeenCalledWith("security.twoFaEnableTitle");
  });

  it("calls mutation with twoFactorAuth: true when enabling succeeds", async () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockUpdateSellerPreferences).toHaveBeenCalledWith({
      variables: {
        input: { sellerId: "seller-1", twoFactorAuth: true },
      },
    });
  });

  it("sets isEnabled to true after successful enable", async () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(result.current.isEnabled).toBe(true);
  });

  it("calls setBiometricEnabled(true) after enabling", async () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockSetBiometricEnabled).toHaveBeenCalledWith(true);
  });

  it("shows success toast after enabling", async () => {
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockShowSuccess).toHaveBeenCalledWith({
      title: "security.twoFaActivated",
      message: "security.twoFaActivatedMessage",
    });
  });

  // ── Biometric prompt failure ───────────────────────────────────────────────

  it("does not enable 2FA when biometric prompt is rejected", async () => {
    mockAuthenticate.mockResolvedValue(false);
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockUpdateSellerPreferences).not.toHaveBeenCalled();
    expect(result.current.isEnabled).toBe(false);
  });

  // ── Disabling 2FA ─────────────────────────────────────────────────────────

  it("does NOT prompt biometrics when disabling 2FA", async () => {
    mockBiometricEnabled = true;
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockAuthenticate).not.toHaveBeenCalled();
  });

  it("calls mutation with twoFactorAuth: false when disabling", async () => {
    mockBiometricEnabled = true;
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockUpdateSellerPreferences).toHaveBeenCalledWith({
      variables: {
        input: { sellerId: "seller-1", twoFactorAuth: false },
      },
    });
  });

  it("shows deactivated toast after disabling", async () => {
    mockBiometricEnabled = true;
    const { result } = renderHook(() => useTwoFactorAuth());
    await act(async () => { await result.current.toggle(); });
    expect(mockShowSuccess).toHaveBeenCalledWith({
      title: "security.twoFaDeactivated",
      message: "security.twoFaDeactivatedMessage",
    });
  });
});
