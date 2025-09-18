import Avatar from "@/components/Avatar";
import PostTile from "@/components/PostTile";
import ThoughtTile from "@/components/ThoughtTile";
import { useDeColors } from "@/hooks/useDeColors";

import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const Thoughts = () => {
  const { backgroundColor } = useDeColors();
  return (
    <View style={{ flex: 1, backgroundColor }}>
      <View
        style={{
          flex: 0.5,
          alignItems: "center",
          padding: 10,
          backgroundColor: "#ccc",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexShrink: 1,
            alignSelf: "flex-start",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexShrink: 1,
              alignSelf: "flex-start",
            }}
          >
            <Avatar />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                borderRadius: 20,
              }}
            >
              <AntDesign name="plus" size={18} color="black" />
            </View>
          </View>
          <Text
            numberOfLines={2}
            style={{
              fontWeight: "bold",
              textAlignVertical: "center",
            }}
          >
            Your Thoughts
          </Text>
        </View>
        <FlatList
          data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
          renderItem={() => <ThoughtTile />}
          horizontal
          contentContainerStyle={{ gap: 5 }}
        />
      </View>
      <View style={{ flex: 3, backgroundColor: "grey", padding: 10 }}>
        <FlatList
          data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
          renderItem={() => <PostTile />}
        />
      </View>
    </View>
  );
};

export default Thoughts;

const styles = StyleSheet.create({});
