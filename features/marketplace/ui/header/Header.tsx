import { Text } from "@/components/shared/Text/Text";
import { Title } from "@/components/shared/Title/Title";
import { NAMESPACE } from "@/features/marketplace/i18n";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import {
  ImageBackground,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";

interface HeaderProps {
  wallpaperImage: ImageSourcePropType;
  title?: string;
  subtitle?: string;
}

export default function Header({
  wallpaperImage,
  title,
  subtitle,
}: HeaderProps) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <ImageBackground
      source={wallpaperImage}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.65)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Title level="h2" style={styles.title}>
          {title ?? t("marketplace")}
        </Title>
        <Text size="sm" style={styles.subtitle}>
          {subtitle ?? t("headerSubtitle")}
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    justifyContent: "flex-end",
    // borderRadius: 14,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  title: {
    color: "#fff",
  },
  subtitle: {
    color: "rgba(255,255,255,0.80)",
    marginTop: 4,
  },
});
