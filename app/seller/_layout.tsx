import SectionHeader from "@/components/Navigation/Header/SectionHeader";
import { Stack } from "expo-router";

export default function SellerLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <SectionHeader {...props} />,
      }}
    />
  );
}
