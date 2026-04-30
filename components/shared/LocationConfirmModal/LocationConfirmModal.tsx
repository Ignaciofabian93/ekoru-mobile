import MainButton from "@/components/shared/Button/MainButton";
import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import useLocationStore, {
  useDetectedLocation,
  useIsLocationConfirmed,
} from "@/store/useLocationStore";
import { MapPin, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

/**
 * LocationConfirmModal — appears once when the app detects the user's location
 * for the first time. The user confirms or dismisses (can reset later from settings).
 */
export default function LocationConfirmModal() {
  const { t } = useTranslation();
  const detected = useDetectedLocation();
  const isConfirmed = useIsLocationConfirmed();
  const confirm = useLocationStore((s) => s.confirm);
  const dismissDetected = useLocationStore((s) => s.dismissDetected);

  const isVisible = !!detected && !isConfirmed;

  const handleConfirm = async () => {
    await confirm();
  };

  // Dismiss without saving — user can update location from settings later
  const handleDismiss = () => {
    dismissDetected();
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Dismiss button */}
          <Pressable style={styles.closeButton} onPress={handleDismiss}>
            <X size={18} color={colors.foregroundTertiary} />
          </Pressable>

          {/* Icon */}
          <View style={styles.iconWrapper}>
            <MapPin size={28} color={colors.primary} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{t("location.detectedTitle")}</Text>

          {/* Location label */}
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>
              {detected!.city
                ? `${detected!.city}, ${detected!.country}`
                : detected!.country}
            </Text>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>{t("location.detectedSubtitle")}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <MainButton
              text={t("location.confirm")}
              onPress={handleConfirm}
              style={styles.confirmButton}
            />
            <Pressable style={styles.dismissButton} onPress={handleDismiss}>
              <Text style={styles.dismissText}>
                {t("location.notMyLocation")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius["2xl"],
    borderTopRightRadius: borderRadius["2xl"],
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: "center",
    gap: 12,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 6,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.primary}18`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.foreground,
    textAlign: "center",
  },
  locationRow: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
    marginVertical: 4,
  },
  locationText: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.base,
    color: colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    color: colors.foregroundSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  actions: {
    width: "100%",
    gap: 10,
    marginTop: 8,
  },
  confirmButton: {
    width: "100%",
  },
  dismissButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  dismissText: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    color: colors.foregroundTertiary,
  },
});
