import Colors from "@/constants/Colors";
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
          <ShieldCheck size={40} color={Colors.primary} strokeWidth={1.5} />
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
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <BiometricIcon size={22} color="#fff" strokeWidth={1.75} />
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
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "100%",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${Colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#6b7280",
  },
  name: {
    fontSize: 22,
    fontFamily: "Cabin_700Bold",
    color: "#1f2937",
    marginTop: -4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Cabin_400Regular",
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 8,
  },
  biometricBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: "100%",
    justifyContent: "center",
  },
  biometricBtnDisabled: {
    opacity: 0.6,
  },
  biometricBtnText: {
    fontSize: 16,
    fontFamily: "Cabin_600SemiBold",
    color: "#fff",
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Cabin_400Regular",
    color: "#dc2626",
    textAlign: "center",
  },
  passwordBtn: {
    paddingVertical: 8,
  },
  passwordBtnText: {
    fontSize: 14,
    fontFamily: "Cabin_500Medium",
    color: "#6b7280",
  },
});
