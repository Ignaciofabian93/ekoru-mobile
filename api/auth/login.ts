import { REST_URL } from "@/config/endpoints";
import useAuthStore from "@/store/useAuthStore";

export async function Login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${REST_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data as { token: string; refreshToken: string; message: string };
}

// Sends the stored refresh token in the request body (cookie-based refresh
// does not work in React Native — tokens are stored in expo-secure-store).
export async function RefreshToken() {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  const response = await fetch(`${REST_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data as { token: string; success: boolean };
}
