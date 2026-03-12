import SectionHeader from "@/components/shared/Header/SectionHeader";
import { Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    />
  );
}
