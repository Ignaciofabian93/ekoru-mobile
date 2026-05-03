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
const mockUpdatePassword = jest.fn();
jest.mock("@apollo/client/react", () => ({
  useMutation: () => [mockUpdatePassword, { loading: false }],
}));

import { act, renderHook } from "@testing-library/react-native";
import useChangePassword from "../hooks/useChangePassword";

describe("useChangePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdatePassword.mockResolvedValue({});
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("initialises with empty fields", () => {
    const { result } = renderHook(() => useChangePassword());

    expect(result.current.currentPassword).toBe("");
    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.loading).toBe(false);
  });

  // ── Field setters ──────────────────────────────────────────────────────────

  it("updates currentPassword", () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => result.current.setCurrentPassword("old123"));
    expect(result.current.currentPassword).toBe("old123");
  });

  it("updates newPassword", () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => result.current.setNewPassword("new456"));
    expect(result.current.newPassword).toBe("new456");
  });

  it("updates confirmPassword", () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => result.current.setConfirmPassword("new456"));
    expect(result.current.confirmPassword).toBe("new456");
  });

  // ── Validation: empty fields ───────────────────────────────────────────────

  it("shows error when currentPassword is empty", async () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.setNewPassword("new456");
      result.current.setConfirmPassword("new456");
    });
    await act(async () => { await result.current.handleSubmit(); });
    expect(mockShowError).toHaveBeenCalledWith({
      title: "Error",
      message: "password.error_fillFields",
    });
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it("shows error when newPassword is empty", async () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.setCurrentPassword("old123");
      result.current.setConfirmPassword("new456");
    });
    await act(async () => { await result.current.handleSubmit(); });
    expect(mockShowError).toHaveBeenCalledWith({
      title: "Error",
      message: "password.error_fillFields",
    });
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  it("shows error when confirmPassword is empty", async () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.setCurrentPassword("old123");
      result.current.setNewPassword("new456");
    });
    await act(async () => { await result.current.handleSubmit(); });
    expect(mockShowError).toHaveBeenCalledWith({
      title: "Error",
      message: "password.error_fillFields",
    });
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  // ── Validation: password mismatch ──────────────────────────────────────────

  it("shows error when newPassword and confirmPassword do not match", async () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.setCurrentPassword("old123");
      result.current.setNewPassword("new456");
      result.current.setConfirmPassword("different789");
    });
    await act(async () => { await result.current.handleSubmit(); });
    expect(mockShowError).toHaveBeenCalledWith({
      title: "Error",
      message: "password.error_passwordMismatch",
    });
    expect(mockUpdatePassword).not.toHaveBeenCalled();
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  it("calls updatePassword mutation with correct variables when all fields are valid", async () => {
    const { result } = renderHook(() => useChangePassword());
    act(() => {
      result.current.setCurrentPassword("old123");
      result.current.setNewPassword("new456");
      result.current.setConfirmPassword("new456");
    });
    await act(async () => { await result.current.handleSubmit(); });
    expect(mockUpdatePassword).toHaveBeenCalledWith({
      variables: { currentPassword: "old123", newPassword: "new456" },
    });
    expect(mockShowError).not.toHaveBeenCalled();
  });
});
