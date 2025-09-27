import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomText } from "../../components/CustomText";
import { auth } from "../../firebaseConfig";

// This screen is opened via a deep link like `stream://verify-email`
// Its purpose is to give the user feedback after they return to the app.
const VerifyEmail = () => {
  const [status, setStatus] = useState("Checking verification status...");
  const [error, setError] = useState("");

  useEffect(() => {
    // The user object might take a moment to update after verification.
    // We'll check its status.
    const checkVerification = async () => {
      const user = auth.currentUser;
      if (user) {
        // Reload the user to get the latest emailVerified status
        await user.reload();
        if (user.emailVerified) {
          setStatus("Success! Your email has been verified.");
          setTimeout(() => {
            // Navigate to page 3 (index 2) of the SignUp PagerView
            router.replace({
              pathname: "/SignUp",
              params: { page: "3" },
            });
          }, 2000);
        } else {
          setError(
            "Email not verified. Please try the link again or resend the email."
          );
          // Optionally, navigate back to the beginning of SignUp after a delay
          await auth.currentUser?.delete();
          try {
            await auth.currentUser?.delete();
          } catch (error: any) {
            console.error("Error deleting user:", error.message);
            setError(`Failed to delete account: ${error.message}`);
          }
          setTimeout(() => {
            router.replace({ pathname: "/SignUp", params: { page: "1" } });
          }, 3000);
        }
      } else {
        // This can happen if the user was signed out in the meantime.
        setError("Could not find user. Please sign in and try again.");
        try {
          await auth.currentUser?.delete();
        } catch (error: any) {
          console.error("Error deleting user:", error.message);
          setError(`Failed to delete account: ${error.message}`);
        }
        setTimeout(() => {
          router.replace({ pathname: "/SignUp", params: { page: "0" } });
        }, 3000);
      }
    };

    // Give Firebase a moment to process the user state change
    const timer = setTimeout(checkVerification, 1000);

    return () => clearTimeout(timer);
  }, []);

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
