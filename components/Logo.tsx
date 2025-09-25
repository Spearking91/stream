import React from "react";
import { Image, StyleSheet } from "react-native";

const Logo = () => {
  return (
    <Image
      source={require("../assets/images/logo.png")}
      resizeMode="contain"
      style={{ width: 150, height: 150, overlayColor: "#a49c0aff" }}
    />
  );
};

export default Logo;

const styles = StyleSheet.create({});
