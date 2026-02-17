import Colors from "@/constants/Colors";
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
      accentColor="#16a34a"
      icon={<CheckCircle size={20} color="#16a34a" strokeWidth={2} />}
    />
  ),
  error: (props: BaseToastProps) => (
    <ToastBase
      {...props}
      accentColor="#dc2626"
      icon={<AlertCircle size={20} color="#dc2626" strokeWidth={2} />}
    />
  ),
  info: (props: BaseToastProps) => (
    <ToastBase
      {...props}
      accentColor={Colors.primary}
      icon={<Info size={20} color={Colors.primary} strokeWidth={2} />}
    />
  ),
};

export default toastConfig;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderLeftWidth: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  iconWrapper: {
    flexShrink: 0,
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: "#111827",
  },
  message: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
});
