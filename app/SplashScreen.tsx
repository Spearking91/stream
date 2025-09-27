import { router } from "expo-router";
import { onIdTokenChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CompanySvg from "../assets/svg/company.svg";
import LogoSvg from "../assets/svg/logo.svg";
import { auth } from "../firebaseConfig";
import { useDeColors } from "../hooks/useDeColors";

const SplashScreen = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const { textColor } = useDeColors();

  useEffect(() => {
    // onIdTokenChanged is generally better for reacting to sign-in state changes
    // It runs when the component mounts if the user is already signed in.
    const unsubscribe = onIdTokenChanged(auth, (user) => {
      console.log(
        "Auth state changed:",
        user ? "User logged in" : "User logged out"
      );
      // A small delay to prevent splash screen from flashing
      setTimeout(() => {
        router.replace(user ? "/Chats" : "/login");
      }, 1000);
      setIsAuthReady(true);
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoSvg width={150} height={150} />
      </View>
      <Text style={{ fontWeight: "bold", fontSize: 16, color: textColor }}>
        From
      </Text>
      <CompanySvg width={200} height={100} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
