import ChatSheet from "../../components/ChatSheet";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatPage = () => {
  const params = useLocalSearchParams();
  const { chatId } = params;
  const recepient = params.recepient
    ? JSON.parse(params.recepient as string)
    : null;
  const [isSwitch, setIsSwitch] = useState(false);

  console.log("Chat ID:", chatId, "Recepient:", recepient);

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={60}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require("../../assets/images/image(1).jpg")}
          style={{ flex: 1, padding: 10 }}
        >
          <View style={{ flex: 1 }}>
            <ChatSheet message={"Hello"} isUser={false} />
            <ChatSheet message={"hi"} isUser={true} />
          </View>
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
              style={{ flex: 1 }}
              placeholder={"Type a message..."}
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
              <FontAwesome name="send-o" size={24} color="black" />
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
