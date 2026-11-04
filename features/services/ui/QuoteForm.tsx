import MainButton from "@/components/Primitives/Button/MainButton";
import Input from "@/components/Primitives/Input/Input";
import TextArea from "@/components/Primitives/TextArea/TextArea";
import { colors } from "@/design/tokens";
import { router } from "expo-router";
import { FileCheck, FileText } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import useRequestQuote from "../hooks/useRequestQuote";
import { NAMESPACE } from "../i18n";

interface Props {
  serviceId: string;
  serviceName: string;
  onClose: () => void;
}

/** The quote request, inline on the service screen like the booking form. */
export default function QuoteForm({ serviceId, serviceName, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { draft, update, isValid, loading, done, submit, reset } = useRequestQuote(serviceId);

  const close = () => {
    reset();
    onClose();
  };

  if (done) {
    return (
      <View style={[styles.card, styles.doneCard]}>
        <FileCheck size={36} color={colors.primary} strokeWidth={1.75} />
        <Text style={styles.title}>{t("detail.quote.sentTitle")}</Text>
        <Text style={styles.muted}>{t("detail.quote.sentBody")}</Text>
        <MainButton
          text={t("detail.quote.viewQuotes")}
          variant="outline"
          fullWidth
          onPress={() => {
            close();
            router.push("/(profile)/quotes");
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("detail.quote.title")}</Text>
      <Text style={styles.muted}>{t("detail.quote.intro", { service: serviceName })}</Text>

      <Input
        label={t("detail.quote.subject")}
        placeholder={t("detail.quote.subjectPlaceholder")}
        value={draft.title}
        onChangeText={(value) => update("title", value)}
        maxLength={120}
      />
      <TextArea
        label={t("detail.quote.description")}
        placeholder={t("detail.quote.descriptionPlaceholder")}
        value={draft.description}
        onChangeText={(value) => update("description", value)}
        maxLength={2000}
      />
      <TextArea
        label={t("detail.quote.notes")}
        placeholder={t("detail.quote.notesPlaceholder")}
        value={draft.notes}
        onChangeText={(value) => update("notes", value)}
        maxLength={500}
      />

      <Text style={styles.small}>{t("detail.quote.disclaimer")}</Text>

      <View style={styles.buttons}>
        <View style={styles.flex}>
          <MainButton text={t("detail.quote.cancel")} variant="outline" disabled={loading} onPress={close} />
        </View>
        <View style={styles.flex}>
          <MainButton
            text={t("detail.quote.submit")}
            leftIcon={FileText}
            loading={loading}
            disabled={!isValid}
            onPress={() => void submit()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    padding: 14,
  },
  doneCard: { alignItems: "center" },
  title: { fontSize: 16, fontFamily: "Cabin_600SemiBold", color: colors.foreground, textAlign: "center" },
  muted: { fontSize: 14, fontFamily: "Cabin_400Regular", color: colors.foregroundSecondary, lineHeight: 20 },
  small: { fontSize: 12, fontFamily: "Cabin_400Regular", color: colors.foregroundSecondary, lineHeight: 17 },
  buttons: { flexDirection: "row", gap: 8 },
  flex: { flex: 1 },
});
