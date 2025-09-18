import { useDeColors } from "@/hooks/deColors";
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
