import { CustomText } from "@/components/CustomText";
import { auth } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { applyActionCode } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyEmail = () => {
  const { oobCode } = useLocalSearchParams<{ oobCode: string }>();
  const [status, setStatus] = useState("Verifying...");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (!oobCode) {
        setStatus("Invalid verification link.");
        return;
      }
      try {
        await applyActionCode(auth, oobCode);
        setStatus("Success! Your email has been verified.");
        // Redirect to the main app after a short delay
        setTimeout(() => {
          router.replace("/Chats");
        }, 2000);
      } catch (err: any) {
        setError("Failed to verify email. The link may be expired or invalid.");
        console.error(err);
      }
    };

    handleVerifyEmail();
  }, [oobCode]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        {error ? (
          <CustomText
            style={{ color: "red", fontSize: 18, textAlign: "center" }}
          >
            {error}
          </CustomText>
        ) : (
          <>
            <ActivityIndicator size="large" />
            <CustomText style={{ marginTop: 20, fontSize: 18 }}>
              {status}
            </CustomText>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmail;
