import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Linking, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { CustomText } from "../../components/CustomText";
import { useDeColors } from "../../hooks/useDeColors";

const PleaseVerifyEmail = () => {
  const { textColor } = useDeColors();
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleOpenEmail = async () => {
    try {
      // This will prompt the user to open their default email client.
      const supported = await Linking.canOpenURL("mailto:");
      if (supported) {
        await Linking.openURL("mailto:");
      } else {
        Alert.alert("Error", "Could not open email app.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while trying to open the email app."
      );
    }
  };

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
        <CustomButton
          text="Open Email App"
          onPress={handleOpenEmail}
          style={{ marginTop: 20, width: "100%" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PleaseVerifyEmail;
