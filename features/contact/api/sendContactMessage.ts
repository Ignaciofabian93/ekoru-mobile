import api from "@/api/client";
import { REST_URL } from "@/config/endpoints";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * POST /contact  — sends a contact form submission to the backend.
 * The backend is responsible for email delivery (e.g. via SendGrid / SES).
 */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  await api.post(`${REST_URL}/contact`, payload);
}
