import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const SplashScreen = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    let hasNavigated = false;
    let timer: number | null = null;

    const setupApp = async () => {
      try {
        // Check cached chat data (non-blocking)
        AsyncStorage.getItem("test")
          .then(() => {
            console.log("AsyncStorage is working");
          })
          .catch((err) => {
            console.log("AsyncStorage error:", err);
          });
        const cached = await AsyncStorage.getItem("chatData");
        if (!cached) {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
          );
          const json = await response.json();
          await AsyncStorage.setItem("chatData", JSON.stringify(json));
        } else {
          // Optionally update in background
          fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((json) =>
              AsyncStorage.setItem("chatData", JSON.stringify(json))
            )
            .catch((err) => console.error("Background update failed:", err));
        }
      } catch (error) {
        console.error("Cache setup error:", error);
      }
    };

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "Auth state changed:",
        user ? "User logged in" : "User logged out"
      );

      if (!hasNavigated) {
        hasNavigated = true;
        timer = setTimeout(() => {
          if (user) {
            router.replace("/Chats");
          } else {
            router.replace("/login");
          }
        }, 1000); // 1 second delay
      }

      setIsAuthReady(true);
    });

    // Set up cache (independent of auth)
    setupApp();

    // Cleanup function
    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/images/logo.png")}
          resizeMode="contain"
          style={{ width: 150, height: 150 }}
        />
      </View>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>From</Text>
      <Image
        source={require("../assets/images/full_logo.png")}
        resizeMode="contain"
        style={{ width: "40%", height: 90 }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
