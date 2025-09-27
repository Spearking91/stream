import { Feather, FontAwesome } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../../components/Avatar";
import ChatSheet from "../../components/ChatSheet";
import { useAuth } from "../../hooks/useAuth";
import {
  listenToMessages,
  markMessagesAsRead,
  sendMessageToChat,
} from "../services/FirestoreServices";

const ChatPage = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { chatId } = params;
  let recepient = null;
  try {
    if (params.recepient && typeof params.recepient === "string") {
      recepient = JSON.parse(params.recepient);
    }
  } catch (error) {
    console.error("Failed to parse recipient data:", error);
    // recepient remains null, so the UI can gracefully handle it
  }
  const [isSwitch, setIsSwitch] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Avatar radius={50} source={{ uri: recepient?.profileUrl }} />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {recepient?.username || "User"}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Feather name="camera" size={18} color={"black"} />
          <Feather name="phone" size={18} color={"black"} />
          <Feather name="more-vertical" size={18} color={"black"} />
        </View>
      ),
    });
  }, [navigation, recepient]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = listenToMessages(chatId as string, (newMessages) => {
      setMessages(newMessages);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    // Mark messages as read when the component mounts and chatId is available
    if (chatId && user?.uid) markMessagesAsRead(chatId as string, user.uid);
  }, [chatId, user?.uid]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || !chatId) {
      return;
    }

    await sendMessageToChat(chatId as string, user.uid, messageText.trim());
    setMessageText(""); // Clear the input field
  };

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={60}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require("../../assets/images/image(1).jpg")}
          style={{ flex: 1, padding: 10 }}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatSheet
                message={item.content}
                isRead={item.isRead}
                isUser={item.senderId === user?.uid}
              />
            )}
          />

          <View
            style={{
              flexDirection: "row",
              // marginBottom: 20,
              borderColor: "black",
              backgroundColor: "white",
              borderWidth: 1,
              borderRadius: 10,
              alignItems: "center",
              paddingHorizontal: 10,
              minHeight: 50,
              maxHeight: 100,
            }}
          >
            <Feather name="smile" size={24} color="black" />
            <TextInput
              style={{ flex: 1, marginHorizontal: 10 }}
              placeholder={"Type a message..."}
              value={messageText}
              onChangeText={setMessageText}
              multiline={true}
            />
            <View
              style={{ gap: 10, flexDirection: "row", alignItems: "center" }}
            >
              <Feather
                name={isSwitch ? "camera" : "mic"}
                size={24}
                color="black"
              />
              <TouchableOpacity onPress={handleSendMessage}>
                <FontAwesome name="send-o" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 20 }}></View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({});
