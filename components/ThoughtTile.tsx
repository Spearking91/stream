import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ThoughtTile = () => {
  return (
    <View
      style={{
        width: 150,
        height: 150,
        // justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderRadius: 10,
          backgroundColor: "#ca6e6eff",
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>ThoughtTile</Text>
      </View>
      <Text style={{ fontWeight: "bold" }}>User</Text>
    </View>
  );
};

export default ThoughtTile;

const styles = StyleSheet.create({});
