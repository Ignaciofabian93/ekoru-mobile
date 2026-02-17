import { REST_URL } from "@/config/endpoints";

export async function Login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  };
  const response = await fetch(`${REST_URL}/auth`, options);
  const data = await response.json();
  return data;
}

// Refresh token handler
export async function RefreshToken() {
  const options: RequestInit = {
    method: "POST",
    credentials: "include",
  };
  const response = await fetch(`${REST_URL}/refresh`, options);
  const data = await response.json();
  return data;
}
