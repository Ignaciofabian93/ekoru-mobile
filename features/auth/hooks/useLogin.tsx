import { Login } from "@/api/auth/login";
import { GET_ME } from "@/graphql/auth/login";
import { showError } from "@/lib/toast";
import useAuthStore from "@/store/useAuthStore";
import type { Seller } from "@/types/user";
import { useApolloClient } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function useLogin() {
  const router = useRouter();
  const { t } = useTranslation("auth");
  const client = useApolloClient();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    if (name === "email") setEmail(value);
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
      const authData = await Login({ email, password });
      if (!authData?.token) {
        showError({
          title: t("errorTitle"),
          message: t("invalidCredentials"),
        });
        return;
      }

      // Step 2: GraphQL call — fetch the full seller profile
      const { data } = await client.query<{ me: Seller }>({
        query: GET_ME,
        context: {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
        fetchPolicy: "no-cache",
      });

      if (!data?.me) {
        showError({
          title: t("errorTitle"),
          message: t("userNotFound"),
        });
        return;
      }

      // Step 3: Persist token + seller in secure storage and global state
      await setSession(authData.token, data.me);

      router.replace("/(tabs)");
    } catch {
      showError({
        title: t("errorTitle"),
        message: t("networkError"),
      });
    } finally {
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
