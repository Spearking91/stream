import ChatlistTile from "@/components/ChatlistTile";
import { auth } from "@/firebaseConfig";
import { useDeColors } from "@/hooks/deColors";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

  // 2. Filter data based on search
  const filteredData = chats
    ? chats.filter((item) =>
        item.recepient?.username.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleUserSearch = async (text: string) => {
    setUserSearch(text);
    const results = await searchUsersByUsername(text);
    setSearchResults(results || []);
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
          <ChatlistTile
            User={item.recepient?.username}
            Message={item.lastMessage || "No messages yet"}
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
      <Modal animationType="slide" transparent={true} visible={isLoading}>
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
      </Modal>
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
                  User={item.username}
                  Message={item.email}
                  onPress={() => {
                    handleCreateChat(item.id);
                    console.log("Start chat with", item.username);
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
