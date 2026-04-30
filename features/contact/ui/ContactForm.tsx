import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import TextArea from "@/components/shared/TextArea/TextArea";
import { borderRadius, colors, fontFamily, fontSize, shadows, spacing } from "@/design/tokens";
import { isEmailValid } from "@/utils/regexValidations";
import { Mail, MessageSquare, Send, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import useContactForm from "../hooks/useContactForm";

export default function ContactForm() {
  const { t } = useTranslation("contact");
  const { form, loading, handleFieldChange, handleSubmit } = useContactForm();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBadge}>
          <MessageSquare size={18} color={colors.onPrimary} strokeWidth={2} />
        </View>
        <Text style={styles.cardTitle}>{t("title")}</Text>
      </View>

      <Text style={styles.subtitle}>{t("subtitle")}</Text>

      <View style={styles.fields}>
        <Input
          name="name"
          label={t("form.name")}
          placeholder={t("form.namePlaceholder")}
          value={form.name}
          onChangeText={(v) => handleFieldChange("name", v)}
          leftIcon={User}
          autoCapitalize="words"
        />

        <Input
          name="email"
          label={t("form.email")}
          placeholder={t("form.emailPlaceholder")}
          value={form.email}
          onChangeText={(v) => handleFieldChange("email", v)}
          type="email"
          leftIcon={Mail}
          isInvalid={form.email.length > 0 && !isEmailValid(form.email)}
          errorMessage={
            form.email.length > 0 && !isEmailValid(form.email)
              ? t("form.emailError")
              : undefined
          }
        />

        <Input
          name="subject"
          label={t("form.subject")}
          placeholder={t("form.subjectPlaceholder")}
          value={form.subject}
          onChangeText={(v) => handleFieldChange("subject", v)}
          autoCapitalize="sentences"
        />

        <TextArea
          label={t("form.message")}
          placeholder={t("form.messagePlaceholder")}
          value={form.message}
          onChangeText={(v) => handleFieldChange("message", v)}
          maxLength={1000}
        />
      </View>

      <MainButton
        text={loading ? t("form.submitting") : t("form.submit")}
        onPress={handleSubmit}
        loading={loading}
        rightIcon={Send}
        fullWidth
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[5],
    ...shadows.sm,
    gap: spacing[4],
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
    lineHeight: 20,
    marginTop: -spacing[2],
  },
  fields: {
    gap: spacing[4],
  },
  submitButton: {
    marginTop: spacing[2],
  },
});
