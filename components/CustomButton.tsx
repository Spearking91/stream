import { useDeColors } from "../hooks/useDeColors";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type props = {
  onPress: any;
  isLoading?: boolean;
  text: string;
  style?: any;
  titleColor?: string;
  isGoogle?: boolean;
};
const CustomButton = ({
  onPress,
  isLoading = false,
  text,
  style,
  titleColor = "#fff",
  isGoogle = false,
}: props) => {
  const { textColor, tintColor } = useDeColors();

  return (
    <TouchableOpacity
      style={{
        width: "100%",
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: tintColor,
        ...style,
      }}
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          {isGoogle && <AntDesign name="google" size={24} color={textColor} />}
          <Text style={{ fontWeight: "700", color: titleColor }}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
