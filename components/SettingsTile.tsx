import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SettingsTile = ({
  title,
  data,
}: {
  title: String;
  Icon: any;
  data: any[];
  subject?: String;
  subtitle?: String;
}) => {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{title}</Text>
      <View
        style={{
          padding: 5,
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#ccc",
          borderRadius: 10,
        }}
      >
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const Wrapper = item.onPress ? TouchableOpacity : View;
            return (
              <Wrapper
                onPress={item.onPress}
                style={{
                  borderColor: "black",
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <Feather name={item.Icon} size={24} color="black" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.subject}
                  </Text>
                </View>
                {item.subtitle && (
                  <Text style={{ fontWeight: "500", fontSize: 14 }}>
                    {item.subtitle}
                  </Text>
                )}
              </Wrapper>
            );
          }}
        />
      </View>
    </View>
  );
};

export default SettingsTile;

const styles = StyleSheet.create({});
