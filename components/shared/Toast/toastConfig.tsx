import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import { AlertCircle, CheckCircle, Info } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import type { BaseToastProps } from "react-native-toast-message";

function ToastBase({
  text1,
  text2,
  icon,
  accentColor,
}: BaseToastProps & { icon: React.ReactNode; accentColor: string }) {
  return (
    <View style={[styles.container, { borderLeftColor: accentColor }]}>
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.textWrapper}>
        {text1 && <Text style={styles.title}>{text1}</Text>}
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  );
}

const toastConfig = {
  success: (props: BaseToastProps) => (
    <ToastBase
      {...props}
      accentColor={colors.success}
      icon={<CheckCircle size={20} color={colors.success} strokeWidth={2} />}
    />
  ),
  error: (props: BaseToastProps) => (
    <ToastBase
      {...props}
      accentColor={colors.danger}
      icon={<AlertCircle size={20} color={colors.danger} strokeWidth={2} />}
    />
  ),
  info: (props: BaseToastProps) => (
    <ToastBase
      {...props}
      accentColor={colors.primary}
      icon={<Info size={20} color={colors.primary} strokeWidth={2} />}
    />
  ),
};

export default toastConfig;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    ...shadows.md,
  },
  iconWrapper: {
    flexShrink: 0,
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.semibold,
    color: colors.foreground,
  },
  message: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
});
