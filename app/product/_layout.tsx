import GradientStackHeader from "@/components/shared/Header/GradientStackHeader";
import { Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <GradientStackHeader {...props} />,
      }}
    />
  );
}
