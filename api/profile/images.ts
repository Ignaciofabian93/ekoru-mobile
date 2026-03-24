import api from "@/api/client";
import { GATEWAY_BASE_URL } from "@/config/endpoints";

interface ImageUploadResponse {
  message: string;
  imagePath: string;
  imageUrl: string;
  fileName: string;
  originalSize: number;
  processedSize: number;
}

const UPLOAD_TIMEOUT_MS = 15_000;

async function uploadImage(
  endpoint: string,
  uri: string,
): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const { data } = await api.post<ImageUploadResponse>(endpoint, formData, {
    // Explicit Content-Type tells React Native's networking layer to generate
    // the multipart boundary (same behaviour as the previous fetch calls).
    headers: { "Content-Type": "multipart/form-data" },
    timeout: UPLOAD_TIMEOUT_MS,
  });

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
