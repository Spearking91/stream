import { useDeColors } from "@/hooks/useDeColors";
import {
  AntDesign,
  FontAwesome,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Avatar from "./Avatar";
import { CustomText } from "./CustomText";

const ChatlistTile = ({
  User,
  Message,
  onPress,
  isChat = true,
  isCall = false,
}: {
  User: string;
  Message: string;
  onPress: any;
  isChat?: boolean;
  isCall?: boolean;
}) => {
  const { tabIconDefaultColor } = useDeColors();
  return (
    <TouchableOpacity
      style={{
        paddingVertical: 5,
        flexDirection: "row",
        gap: 10,
        width: "100%",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Avatar source={undefined} />
      <View style={{ flex: 3 }}>
        <CustomText style={{ fontWeight: "500", fontSize: 18 }}>
          {User}
        </CustomText>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          {isCall && (
            <MaterialIcons name="call-received" size={18} color="green" />
          )}
          <CustomText numberOfLines={1} ellipsizeMode="tail">
            {Message}
          </CustomText>
        </View>
      </View>
      {isChat ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <CustomText style={{ fontWeight: "500", fontSize: 12 }}>
            12:00 PM
          </CustomText>
          <AntDesign name="pushpino" size={16} color={tabIconDefaultColor} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          {isCall ? (
            <FontAwesome name="phone" size={20} color="black" />
          ) : (
            <Foundation name="video" size={24} color="black" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatlistTile;

const styles = StyleSheet.create({});
