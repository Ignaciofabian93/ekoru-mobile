import { showError } from "@/lib/toast";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function useLogin() {
  const router = useRouter();
  const { t } = useTranslation("auth");
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
      console.log("Login");
      // TODO: Replace with real auth API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
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
