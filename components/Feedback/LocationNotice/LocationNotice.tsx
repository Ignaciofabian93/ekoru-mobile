import { Text } from "@/components/Primitives/Text/Text";
import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import { useSeller } from "@/store/useAuthStore";
import type { Seller } from "@/types/user";
import { router } from "expo-router";
import { MapPinOff } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

/** Search only finds listings whose seller set a full location. */
export function hasCompleteLocation(seller: Seller | null | undefined): boolean {
  return Boolean(
    (seller?.country?.id ?? seller?.countryId) &&
      (seller?.region?.id ?? seller?.regionId) &&
      (seller?.city?.id ?? seller?.cityId) &&
      (seller?.county?.id ?? seller?.countyId),
  );
}

/**
 * Tells a signed-in seller whose location is incomplete that their listings
 * won't appear in search until they fill it in, with a button to Edit
 * profile. Renders nothing for visitors and for sellers with a full location.
 * The web shows the same notice.
 */
export function LocationNotice({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  const seller = useSeller();

  if (!seller || hasCompleteLocation(seller)) return null;

  return (
    <View accessibilityRole="alert" style={[styles.box, style]}>
      <View style={styles.row}>
        <MapPinOff size={22} color={colors.warning} strokeWidth={2} />
        <View style={styles.text}>
          <Text weight="bold">{t("locationNotice.title")}</Text>
          <Text size="sm" color="secondary">
            {t("locationNotice.body")}
          </Text>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.push("/(profile)/edit-profile")}
      >
        <Text style={styles.buttonLabel}>{t("locationNotice.action")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: 12,
    padding: 16,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: `${colors.warning}66`,
    backgroundColor: `${colors.warning}1A`,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.onPrimary,
  },
});
