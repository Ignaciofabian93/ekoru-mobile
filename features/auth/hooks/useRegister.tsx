import { REGISTER_BUSINESS, REGISTER_PERSON } from "@/graphql/auth/register";
import useAppRouter from "@/hooks/useAppRouter";
import useUserSettings from "@/hooks/useUserSettings";
import { showError, showSuccess } from "@/lib/toast";
import type { BusinessType, SellerType } from "@/types/enums";
import { sanitizeEmail, sanitizeInput, sanitizeOnSubmit } from "@/utils/inputSanitize";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../i18n";

/** Bounds of the message a business writes for EKORU's review (mirrors ekoru-users). */
export const APPLICATION_MESSAGE_MIN = 50;
export const APPLICATION_MESSAGE_MAX = 3000;

export default function useRegister() {
  const { navigate } = useAppRouter();
  const { t } = useTranslation("auth");
  const { storedLanguage } = useUserSettings();

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
  const [applicationMessage, setApplicationMessage] = useState<string>("");
  // Set once a business application is sent: the account waits for EKORU's
  // review, so the form shows where we'll write instead of the login screen.
  const [applicationSentTo, setApplicationSentTo] = useState<string | null>(null);

  const onCompleted = () => {
    showSuccess({
      title: t("successTitle"),
      message: t("registerSuccess"),
    });
    navigate("/(auth)");
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

  // A business can't sign in until EKORU approves it, so there is no login to
  // send it to yet.
  const [registerBusiness, { loading: loadingBusiness }] = useMutation(REGISTER_BUSINESS, {
    onCompleted: () => setApplicationSentTo(email),
    onError,
    fetchPolicy: "no-cache",
  });

  const loading = loadingPerson || loadingBusiness;

  const handleFieldChange = ({ name, value }: { name: string; value: string }) => {
    if (name === "firstName") setFirstName(sanitizeInput(value));
    if (name === "lastName") setLastName(sanitizeInput(value));
    if (name === "email") setEmail(sanitizeEmail(value));
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    if (name === "businessName") setBusinessName(sanitizeInput(value));
    if (name === "displayName") setDisplayName(sanitizeInput(value));
    if (name === "businessType") setBusinessType(value as BusinessType);
    if (name === "sellerType") setSellerType(value as SellerType);
    // Free text with line breaks; the backend bounds its length.
    if (name === "applicationMessage") setApplicationMessage(value);
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
      if (applicationMessage.trim().length < APPLICATION_MESSAGE_MIN) {
        showError({
          title: t("errorTitle"),
          message: t("applicationMessageTooShort", { min: APPLICATION_MESSAGE_MIN }),
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
          input: {
            sellerType,
            firstName: sanitizeOnSubmit(firstName),
            lastName: sanitizeOnSubmit(lastName),
            email,
            password,
          },
          language: storedLanguage?.toUpperCase() || "ES",
        },
      });
    } else {
      await registerBusiness({
        variables: {
          input: {
            sellerType,
            businessType,
            businessName: sanitizeOnSubmit(businessName),
            displayName: sanitizeOnSubmit(displayName),
            // Trim only: the line breaks are kept in the email to EKORU.
            applicationMessage: applicationMessage.trim(),
            email,
            password,
          },
          language: storedLanguage?.toUpperCase() || "ES",
        },
      });
    }
  };

  const isSubmitEnabled = () => {
    if (!termsAccepted) return false;

    if (sellerType === "PERSON") {
      return firstName && email && password && confirmPassword;
    }

    return (
      businessType &&
      businessName &&
      displayName &&
      applicationMessage.trim().length >= APPLICATION_MESSAGE_MIN &&
      email &&
      password &&
      confirmPassword
    );
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
    applicationMessage,
    applicationSentTo,
    termsAccepted,
    setTermsAccepted,
    isSubmitEnabled,
  };
}
