import MainButton from "@/components/shared/Button/MainButton";
import Input from "@/components/shared/Input/Input";
import { ArrowRight, Lock, Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import useLogin from "../hooks/useLogin";

export default function LoginForm() {
  const { handleFieldChange, handleLogin, email, password, loading } =
    useLogin();
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
});
