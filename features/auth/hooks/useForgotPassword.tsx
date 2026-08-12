import { REQUEST_PASSWORD_RESET } from "@/graphql/auth/profile";
import { logger } from "@/lib/logger";
import { showError } from "@/lib/toast";
import { sanitizeEmail, sanitizeOnSubmit } from "@/utils/inputSanitize";
import { isEmailValid } from "@/utils/regexValidations";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

/**
 * Asks the backend to email a password-reset link.
 *
 * `sent` flips on any successful call, including for addresses with no account:
 * the mutation answers identically either way on purpose, and the UI must not
 * undo that by reporting "no such user".
 */
export default function useForgotPassword() {
  const { t, i18n } = useTranslation("auth");

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  const handleFieldChange = (value: string) => setEmail(sanitizeEmail(value));

  const handleSubmit = async () => {
    const address = sanitizeOnSubmit(email).toLowerCase();
    if (!isEmailValid(address)) {
      showError({ title: t("errorTitle"), message: t("emailError") });
      return;
    }

    try {
      await requestReset({
        variables: {
          email: address,
          language: (i18n.language || "es").slice(0, 2).toUpperCase(),
        },
      });
      setSent(true);
    } catch (err) {
      logger.error("[ForgotPassword] request failed:", err);
      showError({ title: t("errorTitle"), message: t("networkError") });
    }
  };

  return { email, sent, loading, handleFieldChange, handleSubmit };
}
