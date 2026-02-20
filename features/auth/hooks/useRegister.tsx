import { REGISTER_BUSINESS, REGISTER_PERSON } from "@/graphql/auth/register";
import { showError, showSuccess } from "@/lib/toast";
import type { SellerType } from "@/types/enums";
import { useMutation } from "@apollo/client/react";
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

  const onCompleted = () => {
    showSuccess({
      title: t("successTitle"),
      message: t("registerSuccess"),
    });
    router.back();
  };

  const onError = (error: Error) => {
    showError({
      title: t("errorTitle"),
      message: error.message,
    });
  };

  const [registerPerson, { loading: loadingPerson }] = useMutation(
    REGISTER_PERSON,
    {
      onCompleted,
      onError,
      fetchPolicy: "no-cache",
    },
  );

  const [registerBusiness, { loading: loadingBusiness }] = useMutation(
    REGISTER_BUSINESS,
    {
      onCompleted,
      onError,
      fetchPolicy: "no-cache",
    },
  );

  const loading = loadingPerson || loadingBusiness;

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

    if (sellerType === "PERSON") {
      await registerPerson({
        variables: {
          input: { firstName, lastName, email, password },
        },
      });
    } else {
      await registerBusiness({
        variables: {
          input: { firstName, lastName, email, password },
        },
      });
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
