import MainButton from "@/components/Primitives/Button/MainButton";
import DatePicker from "@/components/Primitives/DatePicker/DatePicker";
import Input from "@/components/Primitives/Input/Input";
import TextArea from "@/components/Primitives/TextArea/TextArea";
import { colors } from "@/design/tokens";
import { router } from "expo-router";
import { CalendarCheck, CalendarPlus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import useBookService from "../hooks/useBookService";
import { NAMESPACE } from "../i18n";
import { earliestBookingDate } from "../utils/booking";

interface Props {
  serviceId: string;
  serviceName: string;
  advanceBookingDays: number | null;
  onClose: () => void;
}

/**
 * The booking request, inline on the service screen rather than in a modal:
 * the date picker opens its own modal on iOS, and two stacked modals misbehave.
 */
export default function BookingForm({ serviceId, serviceName, advanceBookingDays, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { draft, update, isValid, loading, done, submit, reset } = useBookService(serviceId);

  const close = () => {
    reset();
    onClose();
  };

  if (done) {
    return (
      <View style={[styles.card, styles.doneCard]}>
        <CalendarCheck size={36} color={colors.primary} strokeWidth={1.75} />
        <Text style={styles.title}>{t("detail.booking.sentTitle")}</Text>
        <Text style={styles.muted}>{t("detail.booking.sentBody")}</Text>
        <MainButton
          text={t("detail.booking.viewBookings")}
          variant="outline"
          fullWidth
          onPress={() => {
            close();
            router.push("/(profile)/bookings");
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("detail.booking.title")}</Text>
      <Text style={styles.muted}>{t("detail.booking.intro", { service: serviceName })}</Text>

      <DatePicker
        label={t("detail.booking.date")}
        value={draft.date}
        onChange={(value) => update("date", value)}
        placeholder={t("detail.booking.datePlaceholder")}
        confirmLabel={t("detail.booking.confirmDate")}
        minimumDate={earliestBookingDate(advanceBookingDays)}
      />
      <Input
        label={t("detail.booking.timeSlot")}
        placeholder={t("detail.booking.timeSlotPlaceholder")}
        value={draft.timeSlot}
        onChangeText={(value) => update("timeSlot", value)}
      />
      <TextArea
        label={t("detail.booking.notes")}
        placeholder={t("detail.booking.notesPlaceholder")}
        value={draft.notes}
        onChangeText={(value) => update("notes", value)}
        maxLength={500}
      />

      <Text style={styles.small}>{t("detail.booking.disclaimer")}</Text>

      <View style={styles.buttons}>
        <View style={styles.flex}>
          <MainButton text={t("detail.booking.cancel")} variant="outline" disabled={loading} onPress={close} />
        </View>
        <View style={styles.flex}>
          <MainButton
            text={t("detail.booking.submit")}
            leftIcon={CalendarPlus}
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
