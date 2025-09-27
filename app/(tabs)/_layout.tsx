import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../hooks/useAuth";
import { useDeColors } from "../../hooks/useDeColors";

function HeaderRightAvatar() {
  const { user, loading } = useAuth();

  if (loading) {
    return <ActivityIndicator style={{ marginRight: 15 }} />;
  }

  return (
    <View style={{ marginRight: 10 }}>
      <Avatar radius={35} source={{ uri: user?.details?.profileUrl }} />
    </View>
  );
}

export default function TabsLayout() {
  const { textColor, backgroundColor, tintColor } = useDeColors();
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
          headerTitleStyle: { fontWeight: "bold", color: tintColor },
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-outline" size={24} color={color} />
          ),
          headerRight: () => <HeaderRightAvatar />,
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
