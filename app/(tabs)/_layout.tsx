import Avatar from "@/components/Avatar";
import { useDeColors } from "@/hooks/deColors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
   const { textColor, backgroundColor } = useDeColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: textColor,
        headerStyle: { backgroundColor: backgroundColor },
        tabBarStyle: { backgroundColor: backgroundColor },
      }}
    >
      <Tabs.Screen
        name="Chats"
        options={{
          title: "Chats",
          headerTitle: "Chats",
          headerTitleStyle: { fontWeight: "bold", color: "#1E90FF" },
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-outline" size={24} color={color} />
          ),
          headerRight: () => (
            <View style={{ marginRight: 10, gap: 30, flexDirection: "row" }}>
              {/* <Feather name="more-vertical" size={24} color="black" /> */}
              <Avatar radius={35} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Views"
        options={{
          title: "Views",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="view-carousel-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Thoughts"
        options={{
          title: "Thoughts",

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="thought-bubble-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Calls"
        options={{
          title: "Calls",
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons name="call-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
