import { router } from "expo-router";
import React from "react";
import { Button, View } from "react-native";
import PagerView from "react-native-pager-view";

const SettingsPage = () => {
  return (
    <PagerView style={{ flex: 1 }} initialPage={0}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Go to Upload Profile Page"
          onPress={() => {
            router.push("/UploadProfilePage");
          }}
        />
      </View>
    </PagerView>
  );
};

export default SettingsPage;
