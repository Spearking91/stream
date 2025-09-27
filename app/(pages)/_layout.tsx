import { useDeColors } from "../../hooks/useDeColors";

import { Stack } from "expo-router";
import React from "react";

export default function PagesLayout() {
  const { textColor, backgroundColor } = useDeColors();
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: backgroundColor },
        headerStyle: { backgroundColor: backgroundColor },
        headerTintColor: textColor,
      }}
    >
      <Stack.Screen name="ChatPage" options={{ headerShown: false }} />
    </Stack>
  );
}
