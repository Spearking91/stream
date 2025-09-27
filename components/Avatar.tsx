import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const Avatar = ({
  style,
  radius = 50,
  source = require("../assets/images/image(1).jpg"),
}: {
  style?: any;
  radius?: number;
  source?: any;
}) => {
  return (
    <TouchableOpacity
      style={{
        width: radius,
        height: radius,
        borderRadius: radius / 2,
        backgroundColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      <Image
        source={source}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </TouchableOpacity>
  );
};

export default Avatar;

const styles = StyleSheet.create({});
