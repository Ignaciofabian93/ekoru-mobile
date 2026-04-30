import SectionHeader from "@/components/shared/Header/SectionHeader";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ContactLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ title: t("screens.contact.title") }} />
    </Stack>
  );
}
