import { RefreshToken } from "@/api/auth/login";
import { GATEWAY_BASE_URL } from "@/config/endpoints";
import useAuthStore from "@/store/useAuthStore";

interface ProductImageUploadResponse {
  message: string;
  imagePath: string;
  imageUrl: string;
  fileName: string;
  originalSize: number;
  processedSize: number;
}

const UPLOAD_TIMEOUT_MS = 15_000;

async function doFetch(uri: string, token: string | null): Promise<Response> {
  const formData = new FormData();
  formData.append("image", {
    uri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  try {
    return await fetch(`${GATEWAY_BASE_URL}/api/images/upload/product`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function uploadProductImage(uri: string): Promise<string> {
  let token = useAuthStore.getState().token;
  let response = await doFetch(uri, token);

  if (response.status === 401) {
    const refreshed = await RefreshToken();
    if (refreshed?.token) {
      await useAuthStore.getState().updateToken(refreshed.token);
      token = refreshed.token;
      response = await doFetch(uri, token);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      (error as { message?: string })?.message ?? "Image upload failed";
    throw new Error(message);
  }

  const data = (await response.json()) as ProductImageUploadResponse;
  return `${GATEWAY_BASE_URL}${data.imagePath}`;
}
