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

// Mock useAppRouter.
// back() must invoke its onTransition callback — that's where setLoading(false)
// lives in the success path, so without it loading stays true.
const mockBack = jest.fn().mockImplementation(
  (_fallback: string, onTransition?: () => void) => onTransition?.(),
);
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
jest.mock("@/hooks/useAppRouter", () => ({
  __esModule: true,
  default: () => ({
    back: mockBack,
    navigate: mockNavigate,
    replace: mockReplace,
    isPending: false,
  }),
}));

// Mock toast
const mockShowError = jest.fn();
jest.mock("@/lib/toast", () => ({
  showError: (...args: unknown[]) => mockShowError(...args),
}));

// Mock Apollo client
const mockQuery = jest.fn();
jest.mock("@apollo/client/react", () => ({
  useApolloClient: () => ({ query: mockQuery }),
}));

// Mock auth store
const mockSetSession = jest.fn();
jest.mock("@/store/useAuthStore", () => ({
  __esModule: true,
  default: jest.fn(
    (selector: (s: { setSession: typeof mockSetSession }) => unknown) =>
      selector({ setSession: mockSetSession }),
  ),
}));

// Mock logger — prevents @sentry/react-native from spinning up background
// workers/timers that would keep Jest alive after the test run completes.
jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Login REST API
const mockLogin = jest.fn();
jest.mock("@/api/auth/login", () => ({
  Login: (...args: unknown[]) => mockLogin(...args),
}));

import { act, renderHook } from "@testing-library/react-native";
import useLogin from "../hooks/useLogin";

const VALID_EMAIL = "test@example.com";
const VALID_PASSWORD = "secret123";

describe("useLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Restore the back mock implementation after clearAllMocks resets it
    mockBack.mockImplementation(
      (_fallback: string, onTransition?: () => void) => onTransition?.(),
    );
    mockSetSession.mockResolvedValue(undefined);
    mockLogin.mockResolvedValue({
      token: "fake-token",
      refreshToken: "fake-refresh",
      message: "ok",
    });
    mockQuery.mockResolvedValue({ data: { me: { id: "seller-1" } } });
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it("initializes with empty fields and default state", () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.showPassword).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  // ── handleFieldChange ──────────────────────────────────────────────────────

  it("sanitizes email: trims whitespace and lowercases", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: "  TEST@EXAMPLE.COM  " });
    });

    expect(result.current.email).toBe("test@example.com");
  });

  it("updates password unchanged via handleFieldChange", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "password", value: "secret123" });
    });

    expect(result.current.password).toBe("secret123");
  });

  it("ignores unknown field names", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "unknown", value: "something" });
    });

    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
  });

  it("toggles showPassword via setShowPassword", () => {
    const { result } = renderHook(() => useLogin());

    act(() => { result.current.setShowPassword(true); });
    expect(result.current.showPassword).toBe(true);

    act(() => { result.current.setShowPassword(false); });
    expect(result.current.showPassword).toBe(false);
  });

  // ── Validation: empty fields ───────────────────────────────────────────────

  it("shows fieldsRequired error and does not call REST when email is empty", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "fieldsRequired",
    });
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("shows fieldsRequired error and does not call REST when password is empty", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "fieldsRequired",
    });
    expect(mockLogin).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  // ── REST error handling ────────────────────────────────────────────────────

  it("shows networkError when REST login throws", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "networkError",
    });
    expect(mockSetSession).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("shows invalidCredentials when REST login returns no token", async () => {
    mockLogin.mockResolvedValueOnce({ token: null, refreshToken: null, message: "bad" });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "invalidCredentials",
    });
    expect(mockSetSession).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  // ── GraphQL error handling ─────────────────────────────────────────────────

  it("shows networkError when GraphQL GET_ME throws", async () => {
    mockQuery.mockRejectedValueOnce(new Error("GraphQL error"));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "networkError",
    });
    expect(mockSetSession).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("shows userNotFound when GET_ME returns no seller", async () => {
    mockQuery.mockResolvedValueOnce({ data: { me: null } });

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "userNotFound",
    });
    expect(mockSetSession).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  // ── setSession error handling ──────────────────────────────────────────────

  it("shows networkError when setSession throws", async () => {
    mockSetSession.mockRejectedValueOnce(new Error("Storage error"));

    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "networkError",
    });
    expect(result.current.loading).toBe(false);
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  it("calls setSession with token, seller, and refreshToken on success", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockSetSession).toHaveBeenCalledWith(
      "fake-token",
      { id: "seller-1" },
      "fake-refresh",
    );
    expect(mockShowError).not.toHaveBeenCalled();
  });

  it("calls back('/(tabs)') after a successful login", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockBack).toHaveBeenCalledWith("/(tabs)", expect.any(Function));
  });

  it("resets loading via the back() onTransition callback on success", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    // mockBack invokes its callback synchronously, so loading must be false
    expect(result.current.loading).toBe(false);
  });

  it("passes sanitized email to the REST API", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      // deliberately messy input — sanitizeEmail lowercases + strips spaces
      result.current.handleFieldChange({ name: "email", value: "  TEST@EXAMPLE.COM  " });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockLogin).toHaveBeenCalledWith(
      expect.objectContaining({ email: "test@example.com" }),
    );
  });

  it("does not show any error toast on a fully successful login", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "email", value: VALID_EMAIL });
      result.current.handleFieldChange({ name: "password", value: VALID_PASSWORD });
    });

    await act(async () => { await result.current.handleLogin(); });

    expect(mockShowError).not.toHaveBeenCalled();
  });
});
