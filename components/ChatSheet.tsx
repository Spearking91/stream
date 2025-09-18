import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ChatSheet = ({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) => {
  return (
    <View
      style={{
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        borderTopLeftRadius: isUser ? 10 : 0,
        borderTopRightRadius: isUser ? 0 : 10,
        backgroundColor: isUser ? "#c6f3f8ff" : "#f9fbf8ff",
        borderWidth: 1,
        borderColor: "black",
        minWidth: 100,
        maxWidth: "70%",
        minHeight: 40,
        alignSelf: isUser ? "flex-end" : "flex-start",
        alignItems: isUser ? "flex-end" : "flex-start",
        padding: 10,
        marginBottom: 10,
      }}
    >
      <Text>{message}</Text>
    </View>
  );
};

export default ChatSheet;

const styles = StyleSheet.create({});
