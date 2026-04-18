import MainButton from "@/components/shared/Button/MainButton";
import Colors from "@/constants/Colors";
import { Fingerprint, ShieldCheck, ShieldOff } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useTwoFactorAuth from "../hooks/useTwoFactorAuth";
import "../i18n";
import { NAMESPACE } from "../i18n";

export default function TwoFactorAuthScreen() {
  const { t } = useTranslation(NAMESPACE);
  const { isEnabled, isAvailable, supportedTypes, loading, toggle } =
    useTwoFactorAuth();

  const hasFace = supportedTypes.includes("face");
  const hasFingerprint = supportedTypes.includes("fingerprint");

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* ── Icon ─────────────────────────────────────────────────────────────── */}
      <View style={styles.iconWrap}>
        {isEnabled ? (
          <ShieldCheck size={56} color={Colors.primary} strokeWidth={1.5} />
        ) : (
          <ShieldOff size={56} color="#9ca3af" strokeWidth={1.5} />
        )}
      </View>

      {/* ── Heading ──────────────────────────────────────────────────────────── */}
      <Text style={styles.title}>{t("twoFaTitle")}</Text>
      <Text style={styles.subtitle}>{t("twoFaSubtitle")}</Text>

      {/* ── Status card ──────────────────────────────────────────────────────── */}
      <View
        style={[
          styles.statusCard,
          isEnabled ? styles.statusCardEnabled : styles.statusCardDisabled,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isEnabled ? styles.statusTextEnabled : styles.statusTextDisabled,
          ]}
        >
          {isEnabled ? t("twoFaEnabled") : t("twoFaDisabled")}
        </Text>
      </View>

      {/* ── Explanation ──────────────────────────────────────────────────────── */}
      {isAvailable ? (
        <View style={styles.infoCard}>
          <Fingerprint size={20} color={Colors.primary} strokeWidth={1.5} />
          <Text style={styles.infoText}>{t("twoFaUsesBiometric")}</Text>
          {(hasFace || hasFingerprint) && (
            <Text style={styles.infoSubText}>
              {[
                hasFace && "Face ID",
                hasFingerprint && "Fingerprint",
              ]
                .filter(Boolean)
                .join(" / ")}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.infoCard}>
          <Text style={styles.infoTextMuted}>{t("twoFaNotAvailable")}</Text>
        </View>
      )}

      {/* ── Action button ────────────────────────────────────────────────────── */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      ) : (
        <MainButton
          text={isEnabled ? t("twoFaDisable") : t("twoFaEnable")}
          onPress={toggle}
          variant={isEnabled ? "error" : "primary"}
          disabled={!isAvailable}
          style={styles.button}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 24,
    paddingBottom: 48,
    alignItems: "center",
  },
  iconWrap: {
    marginTop: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  statusCard: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statusCardEnabled: {
    backgroundColor: `${Colors.primary}18`,
  },
  statusCardDisabled: {
    backgroundColor: "#f3f4f6",
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
  },
  statusTextEnabled: {
    color: Colors.primary,
  },
  statusTextDisabled: {
    color: "#6b7280",
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#374151",
    textAlign: "center",
  },
  infoSubText: {
    fontSize: 12,
    fontFamily: "Cabin_500Medium",
    color: Colors.primary,
  },
  infoTextMuted: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#9ca3af",
    textAlign: "center",
  },
  loader: {
    marginTop: 24,
  },
  button: {
    width: "100%",
  },
});
