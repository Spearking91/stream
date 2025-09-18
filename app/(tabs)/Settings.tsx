import Avatar from "@/components/Avatar";
import SettingsTile from "@/components/SettingsTile";
import { auth } from "@/firebaseConfig";
import { useDeColors } from "@/hooks/deColors";

import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
   const {backgroundColor } = useDeColors();
  useEffect(() => {
    console.log("Current user on mount:", auth.currentUser);
  }, []);
  const [data] = useState([
    {
      Icon: "user",
      subject: "Username",
      subtitle: "User1234",
    },
    {
      Icon: "mail",
      subject: "Email",
      subtitle: "User@example.com",
    },
    {
      Icon: "moon",
      subject: "Dark Mode",
      subtitle: "Dark",
    },
  ]);
  const [Account] = useState([
    {
      Icon: "log-out",
      onPress: () => {
        logOut();
      },
      subject: "Logout",
      subtitle: "",
    },
    {
      Icon: "user",
      onPress: () => {
        router.push("/SettingsPage");
      },
      subject: "New Page",
      subtitle: "",
    },
  ]);
  const logOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      console.log(error);
      alert("Failed to log out: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 10, flex: 1, gap: 20, backgroundColor: backgroundColor }}>
      <View>
        <Avatar />
      </View>
      <SettingsTile title={"Preferences"} Icon={undefined} data={data} />
      <SettingsTile title={"Account"} Icon={undefined} data={Account} />
      {isLoading && <ActivityIndicator />}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
