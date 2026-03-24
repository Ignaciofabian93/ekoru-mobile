import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import { GATEWAY_BASE_URL, REST_URL } from "@/config/endpoints";
import useAuthStore from "@/store/useAuthStore";

// Extend InternalAxiosRequestConfig so TypeScript accepts the _retry flag.
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const api = axios.create({ baseURL: GATEWAY_BASE_URL });

// Attach the stored access token to every request. Token is already in Zustand
// memory so no async SecureStore read is needed.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, silently refresh the access token and retry the failed request.
// Subsequent 401s during an in-flight refresh are queued and retried once the
// refresh resolves. If the refresh itself fails the user is logged out.
// (Mirrors the isRefreshing + pendingRequests pattern in lib/apollo.ts.)
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const resolvePendingRequests = (token: string) => {
  pendingRequests.forEach(({ resolve }) => resolve(token));
  pendingRequests = [];
};

const rejectPendingRequests = (error: unknown) => {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) return Promise.reject(error);

    const original = error.config as InternalAxiosRequestConfig;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) throw new Error("No refresh token");

      // Use plain axios.post (not the intercepted `api`) to avoid an infinite
      // 401 loop if the refresh endpoint itself returns a 401.
      const { data } = await axios.post<{ token: string; success: boolean }>(
        `${REST_URL}/refresh`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );

      if (!data?.token) throw new Error("Refresh returned no token");

      await useAuthStore.getState().updateToken(data.token);
      resolvePendingRequests(data.token);

      original.headers.Authorization = `Bearer ${data.token}`;
      return api(original);
    } catch (refreshError) {
      rejectPendingRequests(refreshError);
      await useAuthStore.getState().logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
