import { REGISTER_BUSINESS, REGISTER_PERSON } from "@/graphql/auth/register";
import { showError, showSuccess } from "@/lib/toast";
import type { SellerType, BusinessType } from "@/types/enums";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";
import useAppRouter from "@/hooks/useAppRouter";

export default function useRegister() {
  const { back } = useAppRouter();
  const { t } = useTranslation("auth");

  const [sellerType, setSellerType] = useState<SellerType>("PERSON");
  const [businessType, setBusinessType] = useState<BusinessType>("RETAIL");
  const [businessName, setBusinessName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const onCompleted = () => {
    showSuccess({
      title: t("successTitle"),
      message: t("registerSuccess"),
    });
    back();
  };

  const onError = (error: Error) => {
    showError({
      title: t("errorTitle"),
      message: error.message,
    });
  };

  const [registerPerson, { loading: loadingPerson }] = useMutation(REGISTER_PERSON, {
    onCompleted,
    onError,
    fetchPolicy: "no-cache",
  });

  const [registerBusiness, { loading: loadingBusiness }] = useMutation(REGISTER_BUSINESS, {
    onCompleted,
    onError,
    fetchPolicy: "no-cache",
  });

  const loading = loadingPerson || loadingBusiness;

  const handleFieldChange = ({ name, value }: { name: string; value: string }) => {
    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    if (name === "businessName") setBusinessName(value);
    if (name === "displayName") setDisplayName(value);
    if (name === "businessType") setBusinessType(value as BusinessType);
    if (name === "sellerType") setSellerType(value as SellerType);
  };

  const handleRegister = async () => {
    if (!termsAccepted) {
      showError({
        title: t("errorTitle"),
        message: t("termsRequired"),
      });
      return;
    }

    if (sellerType === "PERSON") {
      if (!firstName || !email || !password || !confirmPassword) {
        showError({
          title: t("errorTitle"),
          message: t("registerFieldsRequired"),
        });
        return;
      }
    }

    if (sellerType !== "PERSON") {
      if (!businessType || !businessName || !displayName || !email || !password || !confirmPassword) {
        showError({
          title: t("errorTitle"),
          message: t("registerFieldsRequired"),
        });
        return;
      }
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
          input: { sellerType, firstName, lastName, email, password },
        },
      });
    } else {
      await registerBusiness({
        variables: {
          input: { sellerType, businessType, businessName, displayName, email, password },
        },
      });
    }
  };

  const isSubmitEnabled = () => {
    if (!termsAccepted) return false;

    if (sellerType === "PERSON") {
      return firstName && email && password && confirmPassword;
    }

    return businessType && businessName && displayName && email && password && confirmPassword;
  };

  return {
    sellerType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    loading,
    handleFieldChange,
    handleRegister,
    businessType,
    businessName,
    displayName,
    termsAccepted,
    setTermsAccepted,
    isSubmitEnabled,
  };
}
