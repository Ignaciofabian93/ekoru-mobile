import { showError } from "@/lib/toast";
import type { SellerType } from "@/types/enums";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function useRegister() {
  const router = useRouter();
  const { t } = useTranslation("auth");

  const [sellerType, setSellerType] = useState<SellerType>("PERSON");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFieldChange = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleRegister = async () => {
    if (!firstName || !email || !password || !confirmPassword) {
      showError({
        title: t("errorTitle"),
        message: t("registerFieldsRequired"),
      });
      return;
    }

    if (password !== confirmPassword) {
      showError({
        title: t("errorTitle"),
        message: t("passwordMismatch"),
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } finally {
      setLoading(false);
    }
  };

  return {
    sellerType,
    setSellerType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    loading,
    handleFieldChange,
    handleRegister,
  };
}
