import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useDeColors } from "../hooks/useDeColors";

const CustomTextInput = ({
  placeholder,
  text,
  value,
  setValue,
  style,
  design,
  keyboardType,
}: {
  placeholder: string;
  text: string;
  value: string;
  setValue: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  design?: StyleProp<ViewStyle>;
  keyboardType?: KeyboardTypeOptions | undefined;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { textColor, tabIconDefaultColor } = useDeColors();
  return (
    <View style={[{ flexDirection: "column" }, style]}>
      <Text
        style={{
          fontWeight: "500",
          paddingLeft: 10,
          color: textColor,
        }}
      >
        {text}
      </Text>
      <View
        style={[
          {
            borderColor: tabIconDefaultColor,
            borderWidth: 1,
            borderRadius: 10,
            padding: 5,
            flexDirection: "row",
            alignItems: "center",
          },
          design,
        ]}
      >
        <TextInput
          keyboardType={keyboardType}
          style={{
            flex: 1,
            color: textColor,
          }}
          placeholder={placeholder}
          placeholderTextColor={tabIconDefaultColor}
          value={value}
          onChangeText={(text) => {
            setValue(text);
          }}
          secureTextEntry={
            (text === "Password" || text === "Confirm Password") &&
            !showPassword
          }
        />
        {(text === "Password" || text === "Confirm Password") && (
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={tabIconDefaultColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({});
