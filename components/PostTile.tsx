import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Avatar from "./Avatar";
import { CustomText } from "./CustomText";

const PostTile = () => {
  return (
    <View
      style={{
        width: "100%",
        minHeight: 300,
        maxHeight: 400,
        flexGrow: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 20,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,

        // 💡 Elevation for Android
        elevation: 8,
      }}
    >
      <View
        style={{
          height: 80,
          //   backgroundColor: "blue",
          width: "100%",
          flexDirection: "row",
          padding: 10,
          gap: 10,
          alignItems: "center",
        }}
      >
        <Avatar radius={30} source={undefined} />
        <View
          style={{
            flexDirection: "column",
            flex: 1,
          }}
        >
          <CustomText>User</CustomText>
          <CustomText style={{ fontSize: 12 }}>31 Aug at 11:32</CustomText>
        </View>
        <TouchableOpacity>
          <Feather name="more-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          width: "100%",
          //   justifyContent: "center",
          paddingHorizontal: 10,
        }}
      >
        <ThemedText type="defaultSemiBold">
          This is a sample post description Lorem ipsum dolor sit amet,
          consectetur adipisicing elit. Officia quo dicta nihil corporis
          dignissimos maiores, quasi at harum magnam, a ut maxime, eveniet
          consectetur nulla exercitationem. Illum eum nulla iure?
        </ThemedText>
      </View>
      <View style={{ flex: 5, backgroundColor: "#ccc", width: "100%" }}>
        <Image
          source={require("../assets/images/image(4).jpg")}
          resizeMode="cover"
          style={{ flex: 1, width: undefined, height: undefined }}
        />
      </View>
      <View
        style={{
          height: 80,
          backgroundColor: "#fff",
          width: "100%",
          justifyContent: "space-between",
          padding: 10,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            gap: 10,
            marginBottom: 5,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 5,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "black",
              paddingHorizontal: 10,
            }}
          >
            <AntDesign name="like2" size={24} color="black" />
            <ThemedText type="defaultSemiBold">0</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 5,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "black",
              paddingHorizontal: 10,
            }}
          >
            <FontAwesome name="commenting-o" size={24} color="black" />
            <ThemedText type="defaultSemiBold">0</ThemedText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 5,

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign name="eye" size={24} color="black" />
          <ThemedText type="defaultSemiBold">0</ThemedText>
        </View>
      </View>
    </View>
  );
};

export default PostTile;

const styles = StyleSheet.create({});
