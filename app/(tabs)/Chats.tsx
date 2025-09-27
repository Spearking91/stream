import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ChatlistTile from "../../components/ChatlistTile";
import { auth } from "../../firebaseConfig";
import { useDeColors } from "../../hooks/useDeColors";
import {
  CreateChatPage,
  listenToUserChats,
  searchUsersByUsername,
} from "../services/FirestoreServices";

const Chats = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(""); // 1. Add search state
  const [isNewChatModalVisible, setIsNewChatModalVisible] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { textColor, backgroundColor, tabIconDefaultColor, tintColor } =
    useDeColors();

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = listenToUserChats((userChats) => {
      setChats(userChats);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Helper function to safely convert timestamp to date
  const getFormattedTime = (timestamp: any) => {
    if (!timestamp) return "No time";

    try {
      let date: Date;

      // Check if it's a Firestore Timestamp with toDate method
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      }
      // Check if it's already a Date object
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Check if it's a timestamp in milliseconds (number)
      else if (typeof timestamp === "number") {
        date = new Date(timestamp);
      }
      // Check if it's a timestamp in seconds (Firestore format)
      else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      }
      // Try to parse as string
      else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else {
        return "Invalid time";
      }

      // Validate the date
      if (isNaN(date.getTime())) {
        return "Invalid time";
      }

      return date.toLocaleTimeString();
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid time";
    }
  };

  // 2. Filter data based on search
  const filteredData = chats
    ? chats.filter((item) =>
        item.recepient?.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleUserSearch = async (text: string) => {
    setUserSearch(text);
    const results = await searchUsersByUsername(text);
    // Filter out the current user from the search results
    const filteredResults =
      results?.filter((user) => user.id !== auth.currentUser?.uid) || [];
    setSearchResults(filteredResults);
  };

  const handleCreateChat = async (recepientId: string) => {
    if (!auth.currentUser) return;
    const chatId = await CreateChatPage(auth.currentUser.uid, recepientId);
    if (chatId) {
      setIsNewChatModalVisible(false);
      setUserSearch("");
      setSearchResults([]);
      const recepient = searchResults.find((user) => user.id === recepientId);
      router.push({
        pathname: "/(pages)/ChatPage",
        params: { chatId, recepient: JSON.stringify(recepient) },
      });
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: backgroundColor }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: tabIconDefaultColor,
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            padding: 10,
            color: textColor,
          }}
          placeholder={"Search chats"}
          placeholderTextColor={tabIconDefaultColor}
          value={search}
          onChangeText={setSearch} // 3. Update search state
        />
        <TouchableOpacity style={{ padding: 10 }}>
          <Feather name="search" size={24} color={tabIconDefaultColor} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredData} // 4. Use filtered data
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor:
                item.unreadCount?.[auth.currentUser?.uid || ""] > 0
                  ? "rgba(0, 255, 0, 0.1)"
                  : "transparent",
              borderRadius: 10,
            }}
          >
            <ChatlistTile
              profile={item.recepient?.profileUrl}
              User={item.recepient?.username}
              Message={item.lastMessage || "No messages yet"}
              time={getFormattedTime(item.lastMessageTimestamp)}
              onPress={() =>
                router.push({
                  pathname: "/(pages)/ChatPage",
                  params: {
                    chatId: item.id,
                    recepient: JSON.stringify(item.recepient),
                  },
                })
              }
            />
          </View>
        )}
      />

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: tintColor,
          borderRadius: 30,
          padding: 5,
        }}
        onPress={() => {
          setIsNewChatModalVisible(true);
        }}
      >
        <Feather name="plus-circle" size={40} color={"#fff"} />
      </TouchableOpacity>
      {/* <Modal animationType="slide" transparent={true} visible={isLoading}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 20,
              width: "80%",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text>Loading Chats...</Text>
            <ActivityIndicator size="large" color={tintColor} />
          </View>
        </View>
      </Modal> */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNewChatModalVisible}
        onRequestClose={() => setIsNewChatModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: backgroundColor,
              height: "90%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderColor: tabIconDefaultColor,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <TextInput
                style={{ flex: 1, padding: 10, color: textColor }}
                placeholder="Search for users..."
                placeholderTextColor={tabIconDefaultColor}
                value={userSearch}
                onChangeText={handleUserSearch}
              />
              <TouchableOpacity style={{ padding: 10 }}>
                <Feather name="search" size={24} color={tabIconDefaultColor} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ChatlistTile
                  displayTrail={false}
                  profile={item.profileUrl}
                  User={item.username}
                  Message={item.email}
                  onPress={() => {
                    handleCreateChat(item.id);
                  }}
                />
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({});
