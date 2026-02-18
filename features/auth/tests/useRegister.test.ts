// Mock i18next — must be before any imports that use it
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: { type: "3rdParty", init: jest.fn() },
}));

jest.mock("@/i18n", () => ({
  __esModule: true,
  default: {
    use: () => ({ init: jest.fn() }),
    addResourceBundle: jest.fn(),
  },
}));

import { act, renderHook } from "@testing-library/react-native";
import useRegister from "../hooks/useRegister";

// Mock expo-router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock toast
const mockShowError = jest.fn();
jest.mock("@/lib/toast", () => ({
  showError: (...args: unknown[]) => mockShowError(...args),
}));

// Helpers
const fillValidFields = (result: ReturnType<typeof useRegister>) => {
  result.handleFieldChange({ name: "firstName", value: "Jane" });
  result.handleFieldChange({ name: "lastName", value: "Doe" });
  result.handleFieldChange({ name: "email", value: "jane@example.com" });
  result.handleFieldChange({ name: "password", value: "secret123" });
  result.handleFieldChange({ name: "confirmPassword", value: "secret123" });
};

describe("useRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("initializes with default state", () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.sellerType).toBe("PERSON");
    expect(result.current.firstName).toBe("");
    expect(result.current.lastName).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.loading).toBe(false);
  });

  // ── handleFieldChange ──────────────────────────────────────────────────────

  it.each([
    ["firstName", "Jane"],
    ["lastName", "Doe"],
    ["email", "jane@example.com"],
    ["password", "secret123"],
    ["confirmPassword", "secret123"],
  ])("updates %s via handleFieldChange", (field, value) => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: field, value });
    });

    expect(result.current[field as keyof ReturnType<typeof useRegister>]).toBe(
      value
    );
  });

  it("ignores unknown field names", () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "unknown", value: "anything" });
    });

    expect(result.current.firstName).toBe("");
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
  });

  // ── setSellerType ──────────────────────────────────────────────────────────

  it("updates sellerType via setSellerType", () => {
    const { result } = renderHook(() => useRegister());

    act(() => result.current.setSellerType("STARTUP"));
    expect(result.current.sellerType).toBe("STARTUP");

    act(() => result.current.setSellerType("COMPANY"));
    expect(result.current.sellerType).toBe("COMPANY");

    act(() => result.current.setSellerType("PERSON"));
    expect(result.current.sellerType).toBe("PERSON");
  });

  // ── Validation: missing required fields ────────────────────────────────────

  it("shows error when firstName is empty", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: "jane@example.com" });
      result.current.handleFieldChange({ name: "password", value: "secret123" });
      result.current.handleFieldChange({ name: "confirmPassword", value: "secret123" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "registerFieldsRequired",
    });
    expect(result.current.loading).toBe(false);
  });

  it("shows error when email is empty", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "firstName", value: "Jane" });
      result.current.handleFieldChange({ name: "password", value: "secret123" });
      result.current.handleFieldChange({ name: "confirmPassword", value: "secret123" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "registerFieldsRequired",
    });
    expect(result.current.loading).toBe(false);
  });

  it("shows error when password is empty", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "firstName", value: "Jane" });
      result.current.handleFieldChange({ name: "email", value: "jane@example.com" });
      result.current.handleFieldChange({ name: "confirmPassword", value: "secret123" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "registerFieldsRequired",
    });
    expect(result.current.loading).toBe(false);
  });

  it("shows error when confirmPassword is empty", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "firstName", value: "Jane" });
      result.current.handleFieldChange({ name: "email", value: "jane@example.com" });
      result.current.handleFieldChange({ name: "password", value: "secret123" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "registerFieldsRequired",
    });
    expect(result.current.loading).toBe(false);
  });

  // ── Validation: password mismatch ──────────────────────────────────────────

  it("shows error when passwords do not match", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "firstName", value: "Jane" });
      result.current.handleFieldChange({ name: "email", value: "jane@example.com" });
      result.current.handleFieldChange({ name: "password", value: "secret123" });
      result.current.handleFieldChange({ name: "confirmPassword", value: "different" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "passwordMismatch",
    });
    expect(result.current.loading).toBe(false);
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  it("does not show error and resets loading when all fields are valid", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => { fillValidFields(result.current); });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("lastName is optional — registers successfully without it", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "firstName", value: "Jane" });
      result.current.handleFieldChange({ name: "email", value: "jane@example.com" });
      result.current.handleFieldChange({ name: "password", value: "secret123" });
      result.current.handleFieldChange({ name: "confirmPassword", value: "secret123" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("sellerType is included in state during registration", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setSellerType("COMPANY");
      fillValidFields(result.current);
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(result.current.sellerType).toBe("COMPANY");
    expect(mockShowError).not.toHaveBeenCalled();
  });
});
