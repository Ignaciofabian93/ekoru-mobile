import { GATEWAY_BASE_URL } from "@/config/endpoints";
import useAuthStore from "@/store/useAuthStore";
import { RefreshToken } from "@/api/auth/login";

interface ImageUploadResponse {
  message: string;
  imagePath: string;
  imageUrl: string;
  fileName: string;
  originalSize: number;
  processedSize: number;
}

const UPLOAD_TIMEOUT_MS = 15_000;

async function doFetch(
  endpoint: string,
  uri: string,
  token: string | null,
): Promise<Response> {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    return await fetch(`${GATEWAY_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function uploadImage(
  endpoint: string,
  uri: string,
): Promise<ImageUploadResponse> {
  let token = useAuthStore.getState().token;
  let response = await doFetch(endpoint, uri, token);

  // On 401, try to refresh the access token once and retry
  if (response.status === 401) {
    const refreshed = await RefreshToken();
    if (refreshed?.token) {
      await useAuthStore.getState().updateToken(refreshed.token);
      token = refreshed.token;
      response = await doFetch(endpoint, uri, token);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = (error as { message?: string })?.message ?? "Upload failed";
    console.error(
      `[uploadImage] ${endpoint} → HTTP ${response.status}:`,
      error,
    );
    throw new Error(message);
  }

  const data = (await response.json()) as ImageUploadResponse;

  // Always build the image URL from GATEWAY_BASE_URL + imagePath so the device
  // can reach it regardless of how the server configured its own external URL.
  return { ...data, imageUrl: `${GATEWAY_BASE_URL}${data.imagePath}` };
}

export function uploadProfileImage(uri: string) {
  return uploadImage("/api/profile-image", uri);
}

export function uploadCoverImage(uri: string) {
  return uploadImage("/api/cover-image", uri);
}
