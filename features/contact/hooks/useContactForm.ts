import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking } from "react-native";

import { logger } from "@/lib/logger";
import { showError, showSuccess } from "@/lib/toast";
import { sanitizeEmail, sanitizeInput, sanitizeOnSubmit } from "@/utils/inputSanitize";
import { isEmailValid } from "@/utils/regexValidations";

import { sendContactMessage } from "../api/sendContactMessage";
import "../i18n";

const NAMESPACE = "contact";
const SUPPORT_EMAIL = "contacto@ekoru.cl";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function useContactForm() {
  const { t } = useTranslation(NAMESPACE);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "email" ? sanitizeEmail(value) : sanitizeInput(value),
    }));
  };

  const validate = (): boolean => {
    const { name, email, subject, message } = form;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showError({ title: t("error.title"), message: t("form.fieldsRequired") });
      return false;
    }

    if (!isEmailValid(email)) {
      showError({ title: t("error.title"), message: t("form.emailInvalid") });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await sendContactMessage({
        name: sanitizeOnSubmit(form.name),
        email: form.email,
        subject: sanitizeOnSubmit(form.subject),
        message: sanitizeOnSubmit(form.message),
      });

      showSuccess({ title: t("success.title"), message: t("success.message") });
      setForm(EMPTY_FORM);
    } catch (err) {
      logger.error("[ContactForm] Failed to send message:", err);

      // Fallback: open the native mail client so the user is never stuck.
      showError({ title: t("error.title"), message: t("error.message") });
      openMailClient();
    } finally {
      setLoading(false);
    }
  };

  /** Opens the native mail client as a last resort if the API call fails. */
  const openMailClient = () => {
    const { name, email, subject, message } = form;
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${body}`;
    Linking.openURL(mailto).catch(() => {
      logger.warn("[ContactForm] Could not open mail client.");
    });
  };

  return {
    form,
    loading,
    handleFieldChange,
    handleSubmit,
    openMailClient,
    supportEmail: SUPPORT_EMAIL,
  };
}
