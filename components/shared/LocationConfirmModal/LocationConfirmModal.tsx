import MainButton from "@/components/shared/Button/MainButton";
import Colors from "@/constants/Colors";
import useLocationStore, {
  useDetectedLocation,
  useIsLocationConfirmed,
} from "@/store/useLocationStore";
import { MapPin, X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

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
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.backdrop}
      >
        <Animated.View
          entering={SlideInDown.duration(300)
            .springify()
            .damping(26)
            .stiffness(260)}
          exiting={SlideOutDown.duration(220)}
          style={styles.sheet}
        >
          {/* Dismiss button */}
          <Pressable style={styles.closeButton} onPress={handleDismiss}>
            <X size={18} color="#888" />
          </Pressable>

          {/* Icon */}
          <View style={styles.iconWrapper}>
            <MapPin size={28} color={Colors.primary} />
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
        </Animated.View>
      </Animated.View>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    borderRadius: 28,
    backgroundColor: `${Colors.primary}18`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontFamily: "Cabin_700Bold",
    fontSize: 18,
    color: "#1a1a1a",
    textAlign: "center",
  },
  locationRow: {
    backgroundColor: "#f4f6f9",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  locationText: {
    fontFamily: "Cabin_600SemiBold",
    fontSize: 16,
    color: Colors.primary,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Cabin_400Regular",
    fontSize: 14,
    color: "#666",
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
    fontFamily: "Cabin_500Medium",
    fontSize: 14,
    color: "#888",
  },
});
