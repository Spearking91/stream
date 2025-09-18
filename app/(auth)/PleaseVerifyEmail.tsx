import { CustomText } from "../../components/CustomText";
import { useDeColors } from "../../hooks/useDeColors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PleaseVerifyEmail = () => {
  const { textColor } = useDeColors();
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          gap: 20,
        }}
      >
        <Ionicons name="mail-unread-outline" size={100} color={textColor} />
        <CustomText style={{ fontSize: 24, fontWeight: "bold" }}>
          Verify your email
        </CustomText>
        <CustomText style={{ textAlign: "center", fontSize: 16 }}>
          We've sent a verification link to{" "}
          <CustomText style={{ fontWeight: "bold" }}>{email}</CustomText>.
          Please check your inbox and click the link to continue.
        </CustomText>
      </View>
    </SafeAreaView>
  );
};

export default PleaseVerifyEmail;
