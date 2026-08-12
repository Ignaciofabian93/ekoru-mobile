import MainButton from "@/components/Primitives/Button/MainButton";
import Input from "@/components/Primitives/Input/Input";
import { colors } from "@/design/tokens";
import useAppRouter from "@/hooks/useAppRouter";
import { isEmailValid } from "@/utils/regexValidations";
import { ArrowRight, Lock, Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useLogin from "../hooks/useLogin";

export default function LoginForm() {
  const { handleFieldChange, handleLogin, email, password, loading } = useLogin();
  const { navigate } = useAppRouter();
  const { t } = useTranslation("auth");

  return (
    <View style={styles.container}>
      <Input
        name="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChangeText={(value) => handleFieldChange({ name: "email", value })}
        type="email"
        leftIcon={Mail}
        isInvalid={email.length > 0 && !isEmailValid(email)}
        errorMessage={email.length > 0 && !isEmailValid(email) ? t("emailError") : undefined}
      />
      <Input
        name="password"
        label={t("password")}
        placeholder={t("passwordPlaceholder")}
        value={password}
        onChangeText={(value) => handleFieldChange({ name: "password", value })}
        type="password"
        leftIcon={Lock}
      />
      <Pressable
        onPress={() => navigate("/(auth)/forgot-password")}
        style={styles.forgotLinkWrapper}
        accessibilityRole="link"
      >
        <Text style={styles.forgotLink}>{t("forgotPassword")}</Text>
      </Pressable>
      <MainButton
        text={t("login")}
        onPress={handleLogin}
        style={{ marginTop: 20 }}
        rightIcon={ArrowRight}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  forgotLinkWrapper: {
    alignSelf: "flex-end",
    marginTop: -12,
  },
  forgotLink: {
    fontSize: 14,
    fontFamily: "Cabin_600SemiBold",
    color: colors.primary,
  },
});
