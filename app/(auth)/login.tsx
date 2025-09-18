import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { auth } from "@/firebaseConfig";
import { useDeColors } from "@/hooks/useDeColors";

import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const login = () => {
  const [isCheck, setIsCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { textColor, tintColor } = useDeColors();

  const login = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        email,
        password.trim()
      );
      if (user) return router.replace("/Chats");
    } catch (error: any) {
      console.log(error);
      alert("Failed to sign in: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgb(113, 197, 236)",
          borderBottomEndRadius: 20,
          borderBottomStartRadius: 20,
          justifyContent: "flex-end",
          gap: 10,
          padding: 15,
        }}
      >
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            color: textColor,
          }}
        >
          Login
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "light",
            color: textColor,
          }}
        >
          Sign in to Stream
        </Text>
        <Text style={{ color: textColor }}>
          Don't have an account?
          <Link
            style={{ fontWeight: "700", color: tintColor }}
            href={"/SignUp"}
          >
            {" "}
            Sign Up
          </Link>
        </Text>
      </View>
      <View style={{ flex: 2, padding: 15, gap: 15 }}>
        <CustomTextInput
          placeholder={"Enter your email address"}
          text={"Email"}
          value={email}
          setValue={setEmail}
        />
        <CustomTextInput
          placeholder={"Enter your password"}
          text={"Password"}
          value={password}
          setValue={setPassword}
        />
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          {/* <CheckBox
            isCheck={isCheck}
            setIsCheck={async () => {
              setIsCheck(!isCheck);
              await AsyncStorage.setItem("rememberMe", (!isCheck).toString());
            }}
          /> */}
          <Link
            style={{ fontWeight: "700", color: tintColor }}
            href={"/ForgotPassword"}
          >
            Forgot Password?
          </Link>
        </View>
        <CustomButton
          isLoading={isLoading}
          text={"Login"}
          onPress={() => {
            login();
          }}
        />
        <Text style={{ textAlign: "center", color: textColor }}>
          By signing in to your account, we believe that you agree to our{" "}
          <Link style={{ fontWeight: "700", color: tintColor }} href={"/"}>
            Terms and Conditions
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
