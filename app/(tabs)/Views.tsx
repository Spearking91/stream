import Avatar from "../../components/Avatar";
import { CustomText } from "../../components/CustomText";
import { useDeColors } from "../../hooks/useDeColors";

import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

const Views = () => {
  const { backgroundColor } = useDeColors();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        padding: 10,
      }}
    >
      <CustomText>Trending Views</CustomText>
      <FlatList
        data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, gap: 10 }}
        renderItem={() => (
          <View
            style={{
              height: 200,
              width: 100,
              borderRadius: 10,
              backgroundColor: "#ccc",
              overflow: "hidden",
            }}
          >
            <Image
              source={require("../../assets/images/image(4).jpg")}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                paddingLeft: 15,
                bottom: 10,
                right: 10,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "condensedBold" }}
                numberOfLines={2}
              >
                Hello
              </Text>
              <Avatar
                style={{
                  borderWidth: 2,
                  borderColor: "#5b9e13ff",
                }}
                radius={30}
                source={undefined}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Views;

const styles = StyleSheet.create({});
