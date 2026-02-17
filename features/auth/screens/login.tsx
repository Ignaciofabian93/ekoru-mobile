import MainButton from "@/components/shared/Button/MainButton";
import Colors from "@/constants/Colors";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { Eye, EyeOff, LogIn } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  };

  const EKORU_LOGO = require("@/assets/images/logo.png");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoSection}>
          <Image source={EKORU_LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headline}>Sustainability starts here</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#b0b7c3"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#b0b7c3"
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={8}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" strokeWidth={1.5} />
                ) : (
                  <Eye size={20} color="#9ca3af" strokeWidth={1.5} />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <MainButton
            text="Log In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            size="lg"
            fullWidth
            rightIcon={LogIn}
            style={styles.loginButton}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.footerLink}> Sign Up</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Continue as guest</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },

  // Logo & branding
  logoSection: {
    alignItems: "center",
    marginBottom: 44,
  },
  logo: {
    width: 240,
    height: 80,
    marginBottom: 20,
  },
  headline: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: -0.3,
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 15,
    color: "#4c4c4c",
    marginTop: 6,
    letterSpacing: 0.1,
  },

  // Form
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5568",
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#f8f9fb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#e8ecf0",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8ecf0",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeButton: {
    paddingHorizontal: 16,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -8,
  },
  forgotText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  loginButton: {
    marginTop: 4,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e0e4ea",
  },
  dividerText: {
    fontSize: 13,
    color: "#a0a8b8",
    fontWeight: "500",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    color: "#8b95a5",
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
  },
  backButton: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 14,
    color: "#a0a8b8",
    fontWeight: "500",
  },
});
