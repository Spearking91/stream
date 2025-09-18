import { useDeColors } from "@/hooks/useDeColors";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { backgroundColor } = useDeColors();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    />
  );
}
