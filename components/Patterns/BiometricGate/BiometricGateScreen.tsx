import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import useBiometricAuth from "@/hooks/useBiometricAuth";
import useAuthStore, { useSeller } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { Fingerprint, ScanFace, ShieldCheck } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function BiometricGateScreen() {
  const router = useRouter();
  const seller = useSeller();
  const unlockWithBiometric = useAuthStore((s) => s.unlockWithBiometric);
  const logout = useAuthStore((s) => s.logout);
  const { isAvailable, supportedTypes, authenticate } = useBiometricAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName =
    seller?.profile?.__typename === "PersonProfile"
      ? seller.profile.firstName
      : seller?.profile?.__typename === "BusinessProfile"
        ? seller.profile.businessName
        : seller?.email ?? "";

  const isFace = supportedTypes.includes("face");
  const BiometricIcon = isFace ? ScanFace : Fingerprint;
  const biometricLabel = isFace ? "Face ID" : "Fingerprint";

  // Auto-prompt on mount once biometric is available
  useEffect(() => {
    if (isAvailable) {
      handleAuthenticate();
    }
  }, [isAvailable]);

  const handleAuthenticate = async () => {
    setLoading(true);
    setError(null);
    const success = await authenticate(`Unlock as ${displayName}`);
    setLoading(false);
    if (success) {
      unlockWithBiometric();
    } else {
      setError("Authentication failed. Try again or use your password.");
    }
  };

  const handleUsePassword = async () => {
    await logout();
    router.replace("/(auth)");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <ShieldCheck size={40} color={colors.primary} strokeWidth={1.5} />
        </View>

        <Text style={styles.greeting}>Welcome back</Text>
        {displayName ? (
          <Text style={styles.name}>{displayName}</Text>
        ) : null}
        <Text style={styles.subtitle}>
          Verify your identity to continue
        </Text>

        <Pressable
          style={[styles.biometricBtn, loading && styles.biometricBtnDisabled]}
          onPress={handleAuthenticate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} size="small" />
          ) : (
            <>
              <BiometricIcon size={22} color={colors.onPrimary} strokeWidth={1.75} />
              <Text style={styles.biometricBtnText}>
                Unlock with {biometricLabel}
              </Text>
            </>
          )}
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable onPress={handleUsePassword} style={styles.passwordBtn}>
          <Text style={styles.passwordBtnText}>Use password instead</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backgroundTertiary,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius["2xl"],
    padding: 32,
    alignItems: "center",
    width: "100%",
    gap: 12,
    ...shadows.xl,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  greeting: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundSecondary,
  },
  name: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
    marginTop: -4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.foregroundTertiary,
    textAlign: "center",
    marginBottom: 8,
  },
  biometricBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: borderRadius.xl,
    width: "100%",
    justifyContent: "center",
  },
  biometricBtnDisabled: {
    opacity: 0.6,
  },
  biometricBtnText: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.semibold,
    color: colors.onPrimary,
  },
  errorText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.danger,
    textAlign: "center",
  },
  passwordBtn: {
    paddingVertical: 8,
  },
  passwordBtnText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.foregroundSecondary,
  },
});
