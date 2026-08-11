import { Text } from "@/components/Primitives/Text/Text";
import { AlertTriangle } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { NAMESPACE } from "./i18n";

interface DownGradePlanProps {
  pendingPlan: {
    label: string;
  };
  subscribing: boolean;
  handleCancelSelection: () => void;
  handleConfirmDowngrade: () => Promise<void>;
}

export default function DownGradePlan({
  pendingPlan,
  subscribing,
  handleCancelSelection,
  handleConfirmDowngrade,
}: DownGradePlanProps) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <View style={styles.confirmCard}>
      <View style={styles.confirmHeader}>
        <AlertTriangle size={18} color="#d97706" strokeWidth={2} />
        <Text style={styles.confirmTitle}>Downgrade to {pendingPlan.label}?</Text>
      </View>
      <Text style={styles.confirmMessage}>
        Your current plan benefits will remain active until the end of the billing period. After that your
        account will switch to Freemium.
      </Text>
      <View style={styles.confirmActions}>
        <Pressable style={styles.cancelButton} onPress={handleCancelSelection} disabled={subscribing}>
          <Text style={styles.cancelButtonText}>{t("downgradeConfirm.cancelButton")}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
            subscribing && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmDowngrade}
          disabled={subscribing}
        >
          {subscribing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {t("downgradeConfirm.confirmButton", { plan: pendingPlan.label })}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmCard: {
    backgroundColor: "#fffbeb",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#fbbf24",
    marginTop: 12,
    gap: 12,
  },
  confirmHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  confirmTitle: {
    fontSize: 15,
    fontFamily: "Cabin_700Bold",
    color: "#92400e",
  },
  confirmMessage: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#78350f",
    lineHeight: 20,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: "#374151",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#d97706",
  },
  confirmButtonPressed: {
    opacity: 0.8,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 13,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
});
