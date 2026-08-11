import SectionHeader from "@/components/Navigation/Header/SectionHeader";
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
