import Avatar from "../../components/Avatar";
import { CustomText } from "../../components/CustomText";
import SettingsTile from "../../components/SettingsTile";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../hooks/useAuth";
import { useDeColors } from "../../hooks/useDeColors";

import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const { backgroundColor } = useDeColors();

  const creationTime = user?.metadata.creationTime;
  const formattedCreationDate = creationTime
    ? new Date(creationTime).toLocaleString("default", {
        month: "long",
        year: "numeric",
      })
    : "";

  const personalInfoData = [
    {
      Icon: "user",
      subject: "Username",
      subtitle: user?.displayName || "No username",
    },
    {
      Icon: "mail",
      subject: "Email",
      subtitle: user?.email || "",
    },
    {
      Icon: "phone",
      subject: "Phone Number",
      subtitle: user?.phoneNumber || "Not set",
    },
    {
      Icon: "info",
      subject: "About",
      subtitle: "I am using Stream!",
    },
  ];
  const accountActions = [
    {
      Icon: "chevrons-down",
      onPress: () => router.push("/Update"),
      subject: "Update App",
      subtitle: "",
    },
    {
      Icon: "log-out",
      onPress: () => logOut(),
      subject: "Logout",
      subtitle: "",
    },
  ];

  const logOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error: any) {
      console.error("Failed to log out: ", error);
      // Consider replacing this with a user-friendly toast/snackbar
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    // You can return a loading spinner for the whole screen here
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View
      style={{
        padding: 10,
        flex: 1,
        gap: 20,
        backgroundColor: backgroundColor,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Avatar source={{ uri: user?.details?.profileUrl }} radius={150} />
        <CustomText style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          {user?.displayName || "No Name"}
        </CustomText>
        <CustomText style={{ fontSize: 16, color: "gray" }}>
          Active since - {formattedCreationDate}
        </CustomText>
      </View>
      <SettingsTile
        title={"Personal Information"}
        Icon={undefined}
        data={personalInfoData}
      />
      <SettingsTile title={"Account"} Icon={undefined} data={accountActions} />
      {isLoading && <ActivityIndicator />}
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
