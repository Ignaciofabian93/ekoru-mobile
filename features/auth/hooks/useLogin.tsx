import { Login } from "@/api/auth/login";
import { GET_ME } from "@/graphql/auth/login";
import { logger } from "@/lib/logger";
import { showError } from "@/lib/toast";
import useAuthStore from "@/store/useAuthStore";
import useAppRouter from "@/hooks/useAppRouter";
import type { Seller } from "@/types/user";
import { useApolloClient } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import { sanitizeEmail, sanitizeOnSubmit } from "@/utils/inputSanitize";

export default function useLogin() {
  const { back } = useAppRouter();
  const { t } = useTranslation("auth");
  const client = useApolloClient();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = ({ name, value }: { name: string; value: string }) => {
    if (name === "email") setEmail(sanitizeEmail(value));
    if (name === "password") setPassword(value);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showError({
        title: t("errorTitle"),
        message: t("fieldsRequired"),
      });
      return;
    }

    setLoading(true);
    try {
      // Step 1: REST call — sets the auth cookie and returns the JWT
      let authData: { token: string; refreshToken: string; message: string };
      try {
        authData = await Login({ email: sanitizeOnSubmit(email), password });
      } catch (restErr) {
        logger.error("[Login] REST Login failed:", restErr);
        showError({ title: t("errorTitle"), message: t("networkError") });
        setLoading(false);
        return;
      }

      if (!authData?.token) {
        showError({
          title: t("errorTitle"),
          message: t("invalidCredentials"),
        });
        setLoading(false);
        return;
      }

      // Step 2: GraphQL call — fetch the full seller profile
      // The Apollo authLink automatically attaches the token from the store,
      // but since setSession hasn't been called yet we pass it explicitly here.
      let data: { me: Seller } | null = null;
      try {
        const result = await client.query<{ me: Seller }>({
          query: GET_ME,
          context: {
            headers: { Authorization: `Bearer ${authData.token}` },
          },
          fetchPolicy: "no-cache",
        });
        data = result.data ?? null;
      } catch (gqlErr) {
        logger.error("[Login] GraphQL GET_ME failed:", gqlErr);
        showError({ title: t("errorTitle"), message: t("networkError") });
        setLoading(false);
        return;
      }

      if (!data?.me) {
        showError({
          title: t("errorTitle"),
          message: t("userNotFound"),
        });
        setLoading(false);
        return;
      }

      // Step 3: Persist token + refreshToken + seller in secure storage and global state
      try {
        await setSession(authData.token, data.me, authData.refreshToken);
      } catch {
        showError({ title: t("errorTitle"), message: t("networkError") });
        setLoading(false);
        return;
      }

      // setLoading(false) must be co-located with back() inside the same
      // startTransition (which useAppRouter applies internally) so that Fabric
      // batches the spinner removal and the navigation tree swap in a single
      // deferred commit — preventing the double-parent IllegalStateException.
      back("/(tabs)", () => setLoading(false));
    } catch (err) {
      logger.error("[Login] Unexpected error:", err);
      showError({
        title: t("errorTitle"),
        message: t("networkError"),
      });
      setLoading(false);
    }
  };

  return {
    email,
    password,
    showPassword,
    setShowPassword,
    loading,
    handleLogin,
    handleFieldChange,
  };
}
