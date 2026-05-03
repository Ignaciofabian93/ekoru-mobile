// Mock i18next — must be before any imports that use it
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

// Mock useAppRouter
const mockNavigate = jest.fn();
jest.mock("@/hooks/useAppRouter", () => ({
  __esModule: true,
  default: () => ({
    navigate: mockNavigate,
    replace: jest.fn(),
    back: jest.fn(),
    isPending: false,
  }),
}));

// Mock toast
const mockShowError = jest.fn();
const mockShowSuccess = jest.fn();
jest.mock("@/lib/toast", () => ({
  showError: (...args: unknown[]) => mockShowError(...args),
  showSuccess: (...args: unknown[]) => mockShowSuccess(...args),
}));

// Mock Apollo useMutation.
// Apollo calls onCompleted/onError internally after the mutation resolves/rejects.
// Our mock captures those options and invokes them so the hook behaves realistically.
type MutationOptions = {
  onCompleted?: () => void;
  onError?: (e: Error) => void;
};
const mockMutationFn = jest.fn();
jest.mock("@apollo/client/react", () => ({
  useMutation: (_query: unknown, options?: MutationOptions) => {
    const fn = jest.fn().mockImplementation(async () => {
      const result = await mockMutationFn();
      if (result instanceof Error) {
        options?.onError?.(result);
      } else {
        options?.onCompleted?.();
      }
      return result;
    });
    return [fn, { loading: false }];
  },
}));

// Mock useUserSettings (provides storedLanguage used by useRegister)
jest.mock("@/hooks/useUserSettings", () => ({
  __esModule: true,
  default: () => ({ storedLanguage: "es" }),
}));

import { act, renderHook } from "@testing-library/react-native";
import useRegister from "../hooks/useRegister";

// ── Helpers ────────────────────────────────────────────────────────────────────

type HookResult = ReturnType<typeof useRegister>;

function fillPersonFields(result: HookResult) {
  result.handleFieldChange({ name: "firstName", value: "Jane" });
  result.handleFieldChange({ name: "lastName", value: "Doe" });
  result.handleFieldChange({ name: "email", value: "jane@example.com" });
  result.handleFieldChange({ name: "password", value: "secret123" });
  result.handleFieldChange({ name: "confirmPassword", value: "secret123" });
}

function fillBusinessFields(result: HookResult) {
  result.handleFieldChange({ name: "sellerType", value: "COMPANY" });
  result.handleFieldChange({ name: "businessType", value: "RETAIL" });
  result.handleFieldChange({ name: "businessName", value: "Acme Corp" });
  result.handleFieldChange({ name: "displayName", value: "Acme" });
  result.handleFieldChange({ name: "email", value: "acme@example.com" });
  result.handleFieldChange({ name: "password", value: "secret123" });
  result.handleFieldChange({ name: "confirmPassword", value: "secret123" });
}

describe("useRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default: mutations succeed
    mockMutationFn.mockResolvedValue({});
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
    expect(result.current.businessName).toBe("");
    expect(result.current.displayName).toBe("");
    expect(result.current.termsAccepted).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  // ── handleFieldChange ──────────────────────────────────────────────────────

  it.each([
    ["firstName", "Jane", "Jane"],
    ["lastName", "Doe", "Doe"],
    // sanitizeEmail lowercases and removes internal spaces
    ["email", "Jane@Example.COM", "jane@example.com"],
    ["password", "secret123", "secret123"],
    ["confirmPassword", "secret123", "secret123"],
    ["businessName", "Acme Corp", "Acme Corp"],
    ["displayName", "Acme", "Acme"],
  ])(
    "updates %s via handleFieldChange (stored as '%s')",
    (field, input, expected) => {
      const { result } = renderHook(() => useRegister());

      act(() => {
        result.current.handleFieldChange({ name: field, value: input });
      });

      expect(result.current[field as keyof HookResult]).toBe(expected);
    },
  );

  it("updates sellerType via handleFieldChange", () => {
    const { result } = renderHook(() => useRegister());

    act(() => { result.current.handleFieldChange({ name: "sellerType", value: "STARTUP" }); });
    expect(result.current.sellerType).toBe("STARTUP");

    act(() => { result.current.handleFieldChange({ name: "sellerType", value: "COMPANY" }); });
    expect(result.current.sellerType).toBe("COMPANY");

    act(() => { result.current.handleFieldChange({ name: "sellerType", value: "PERSON" }); });
    expect(result.current.sellerType).toBe("PERSON");
  });

  it("updates businessType via handleFieldChange", () => {
    const { result } = renderHook(() => useRegister());

    act(() => { result.current.handleFieldChange({ name: "businessType", value: "SERVICES" }); });
    expect(result.current.businessType).toBe("SERVICES");
  });

  it("strips leading spaces and control characters from text inputs", () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.handleFieldChange({ name: "firstName", value: "  Jane" });
    });

    // sanitizeInput removes leading whitespace
    expect(result.current.firstName).toBe("Jane");
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

  // ── setTermsAccepted ───────────────────────────────────────────────────────

  it("toggles termsAccepted via setTermsAccepted", () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.termsAccepted).toBe(false);

    act(() => { result.current.setTermsAccepted(true); });
    expect(result.current.termsAccepted).toBe(true);

    act(() => { result.current.setTermsAccepted(false); });
    expect(result.current.termsAccepted).toBe(false);
  });

  // ── Validation: terms not accepted (checked first) ─────────────────────────

  it("shows termsRequired before any field validation when terms are not accepted", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => { fillPersonFields(result.current); });
    // termsAccepted remains false

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "termsRequired",
    });
    expect(result.current.loading).toBe(false);
  });

  // ── Validation: missing required fields (PERSON) ───────────────────────────

  it("shows registerFieldsRequired when firstName is empty (PERSON)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
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

  it("shows registerFieldsRequired when email is empty (PERSON)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
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

  it("shows registerFieldsRequired when password is empty (PERSON)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
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

  it("shows registerFieldsRequired when confirmPassword is empty (PERSON)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
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

  // ── Validation: missing required fields (BUSINESS) ────────────────────────

  it("shows registerFieldsRequired when businessName is empty (COMPANY)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      result.current.handleFieldChange({ name: "sellerType", value: "COMPANY" });
      result.current.handleFieldChange({ name: "displayName", value: "Acme" });
      result.current.handleFieldChange({ name: "email", value: "acme@example.com" });
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

  it("shows registerFieldsRequired when displayName is empty (COMPANY)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      result.current.handleFieldChange({ name: "sellerType", value: "COMPANY" });
      result.current.handleFieldChange({ name: "businessName", value: "Acme Corp" });
      result.current.handleFieldChange({ name: "email", value: "acme@example.com" });
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

  // ── Validation: password mismatch ──────────────────────────────────────────

  it("shows passwordMismatch when passwords do not match (PERSON)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
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

  it("shows passwordMismatch when passwords do not match (COMPANY)", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      fillBusinessFields(result.current);
      result.current.handleFieldChange({ name: "confirmPassword", value: "different" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "passwordMismatch",
    });
    expect(result.current.loading).toBe(false);
  });

  // ── Happy path: PERSON ─────────────────────────────────────────────────────

  it("calls showSuccess and navigates to /(auth) on successful PERSON registration", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      fillPersonFields(result.current);
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockShowSuccess).toHaveBeenCalledWith({
      title: "successTitle",
      message: "registerSuccess",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/(auth)");
    expect(result.current.loading).toBe(false);
  });

  it("lastName is optional — PERSON registers successfully without it", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      result.current.handleFieldChange({ name: "firstName", value: "Jane" });
      result.current.handleFieldChange({ name: "email", value: "jane@example.com" });
      result.current.handleFieldChange({ name: "password", value: "secret123" });
      result.current.handleFieldChange({ name: "confirmPassword", value: "secret123" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockShowSuccess).toHaveBeenCalled();
  });

  // ── Happy path: BUSINESS ───────────────────────────────────────────────────

  it("calls showSuccess and navigates to /(auth) on successful COMPANY registration", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      fillBusinessFields(result.current);
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(mockShowSuccess).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/(auth)");
    expect(result.current.loading).toBe(false);
  });

  it("STARTUP type follows the business validation path and registers successfully", async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      fillBusinessFields(result.current);
      result.current.handleFieldChange({ name: "sellerType", value: "STARTUP" });
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(result.current.sellerType).toBe("STARTUP");
    expect(mockShowSuccess).toHaveBeenCalled();
  });

  // ── API error handling ─────────────────────────────────────────────────────

  it("shows API error message when mutation returns an Error", async () => {
    mockMutationFn.mockResolvedValueOnce(new Error("Email already taken"));

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      fillPersonFields(result.current);
    });

    await act(async () => { await result.current.handleRegister(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "Email already taken",
    });
    expect(mockShowSuccess).not.toHaveBeenCalled();
  });

  // ── isSubmitEnabled ────────────────────────────────────────────────────────

  it("isSubmitEnabled returns false when terms are not accepted", () => {
    const { result } = renderHook(() => useRegister());

    act(() => { fillPersonFields(result.current); });

    expect(result.current.isSubmitEnabled()).toBeFalsy();
  });

  it("isSubmitEnabled returns false when required PERSON fields are missing", () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      result.current.handleFieldChange({ name: "firstName", value: "Jane" });
      // email, password, confirmPassword missing
    });

    expect(result.current.isSubmitEnabled()).toBeFalsy();
  });

  it("isSubmitEnabled returns true when all PERSON fields are present and terms accepted", () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      fillPersonFields(result.current);
    });

    expect(result.current.isSubmitEnabled()).toBeTruthy();
  });

  it("isSubmitEnabled returns false when required BUSINESS fields are missing", () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      result.current.handleFieldChange({ name: "sellerType", value: "COMPANY" });
      result.current.handleFieldChange({ name: "email", value: "acme@example.com" });
      // businessName and displayName missing
    });

    expect(result.current.isSubmitEnabled()).toBeFalsy();
  });

  it("isSubmitEnabled returns true when all BUSINESS fields are present and terms accepted", () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setTermsAccepted(true);
      fillBusinessFields(result.current);
    });

    expect(result.current.isSubmitEnabled()).toBeTruthy();
  });

  it("isSubmitEnabled flips to true only after terms are accepted", () => {
    const { result } = renderHook(() => useRegister());

    act(() => { fillPersonFields(result.current); });
    expect(result.current.isSubmitEnabled()).toBeFalsy();

    act(() => { result.current.setTermsAccepted(true); });
    expect(result.current.isSubmitEnabled()).toBeTruthy();
  });
});
