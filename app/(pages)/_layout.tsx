import Avatar from "@/components/Avatar";
import { useDeColors } from "@/hooks/useDeColors";

import { AntDesign, Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

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
      <Stack.Screen
        name="ChatPage"
        options={{
          headerShown: true,
          title: "  User",
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="arrowleft" size={20} color={textColor} />
              </TouchableOpacity>
              <Avatar />
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 20 }}>
              <Feather name="camera" size={18} color={textColor} />
              <Feather name="phone" size={18} color={textColor} />
              <Feather name="more-vertical" size={18} color={textColor} />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
