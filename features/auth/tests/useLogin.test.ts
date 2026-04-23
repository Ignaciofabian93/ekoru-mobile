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

// Mock expo-router
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
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

// Mock Login REST API
const mockLogin = jest.fn();
jest.mock("@/api/auth/login", () => ({
  Login: (...args: unknown[]) => mockLogin(...args),
}));

import { act, renderHook } from "@testing-library/react-native";
import useLogin from "../hooks/useLogin";

describe("useLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSetSession.mockResolvedValue(undefined);
    mockLogin.mockResolvedValue({
      token: "fake-token",
      refreshToken: "fake-refresh",
      message: "ok",
    });
    mockQuery.mockResolvedValue({ data: { me: { id: "seller-1" } } });
  });

  it("initializes with empty fields and default state", () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.showPassword).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it("updates email via handleFieldChange", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({
        name: "email",
        value: "test@example.com",
      });
    });

    expect(result.current.email).toBe("test@example.com");
  });

  it("updates password via handleFieldChange", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({
        name: "password",
        value: "secret123",
      });
    });

    expect(result.current.password).toBe("secret123");
  });

  it("ignores unknown field names", () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({
        name: "unknown",
        value: "something",
      });
    });

    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
  });

  it("shows error toast when email is empty", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({ name: "password", value: "secret" });
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "fieldsRequired",
    });
    expect(result.current.loading).toBe(false);
  });

  it("shows error toast when password is empty", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({
        name: "email",
        value: "test@example.com",
      });
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockShowError).toHaveBeenCalledWith({
      title: "errorTitle",
      message: "fieldsRequired",
    });
    expect(result.current.loading).toBe(false);
  });

  it("sets loading during handleLogin and resets after", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.handleFieldChange({
        name: "email",
        value: "test@example.com",
      });
      result.current.handleFieldChange({ name: "password", value: "secret" });
    });

    await act(async () => {
      await result.current.handleLogin();
    });

    expect(mockShowError).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("toggles showPassword via setShowPassword", () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.showPassword).toBe(false);

    act(() => {
      result.current.setShowPassword(true);
    });

    expect(result.current.showPassword).toBe(true);
  });
});
