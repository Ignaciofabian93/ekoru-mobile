import api from "@/api/client";
import { GATEWAY_BASE_URL } from "@/config/endpoints";

interface ProductImageUploadResponse {
  message: string;
  imagePath: string;
  imageUrl: string;
  fileName: string;
  originalSize: number;
  processedSize: number;
}

const UPLOAD_TIMEOUT_MS = 15_000;

export async function uploadProductImage(uri: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", {
    uri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const { data } = await api.post<ProductImageUploadResponse>(
    "/api/images/upload/product",
    formData,
    {
      // Explicit Content-Type tells React Native's networking layer to generate
      // the multipart boundary (same behaviour as the previous fetch calls).
      headers: { "Content-Type": "multipart/form-data" },
      timeout: UPLOAD_TIMEOUT_MS,
    },
  );

  return `${GATEWAY_BASE_URL}${data.imagePath}`;
}
