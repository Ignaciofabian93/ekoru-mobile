import MainButton from "@/components/Primitives/Button/MainButton";
import Input from "@/components/Primitives/Input/Input";
import { colors } from "@/design/tokens";
import { isEmailValid } from "@/utils/regexValidations";
import { ArrowRight, Mail, MailCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import useForgotPassword from "../hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const { email, sent, loading, handleFieldChange, handleSubmit } = useForgotPassword();
  const { t } = useTranslation("auth");

  // Deliberately the same confirmation for every address: saying "no account
  // with that email" here would leak which addresses are registered.
  if (sent) {
    return (
      <View style={styles.sent} accessibilityRole="alert">
        <MailCheck size={40} color={colors.primary} />
        <Text style={styles.sentTitle}>{t("resetSentTitle")}</Text>
        <Text style={styles.sentBody}>{t("resetSentBody")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.intro}>{t("forgotPasswordIntro")}</Text>
      <Input
        name="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChangeText={handleFieldChange}
        type="email"
        leftIcon={Mail}
        isInvalid={email.length > 0 && !isEmailValid(email)}
        errorMessage={email.length > 0 && !isEmailValid(email) ? t("emailError") : undefined}
      />
      <MainButton
        text={t("sendResetLink")}
        onPress={handleSubmit}
        style={{ marginTop: 20 }}
        rightIcon={ArrowRight}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  intro: {
    fontSize: 15,
    fontFamily: "Cabin_500Medium",
    color: "#5c5c5c",
    lineHeight: 22,
  },
  sent: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  sentTitle: {
    fontSize: 17,
    fontFamily: "Cabin_700Bold",
    color: "#2c2c2c",
    textAlign: "center",
  },
  sentBody: {
    fontSize: 15,
    fontFamily: "Cabin_500Medium",
    color: "#5c5c5c",
    textAlign: "center",
    lineHeight: 22,
  },
});
