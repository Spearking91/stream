import { CustomText } from "../../components/CustomText";

import ChatlistTile from "../../components/ChatlistTile";
import { useDeColors } from "../../hooks/useDeColors";

import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ChatItem = {
  id: number;
  name: string;
  address: { geo: { lat: string; lng: string } };
  company: { catchPhrase: string };
};

const Calls = () => {
  const [Data, setData] = useState<ChatItem[] | undefined>(undefined);
  const [search, setSearch] = useState(""); // 1. Add search state
  const { backgroundColor } = useDeColors();

  useEffect(() => {
    const getCachedData = async () => {
      try {
        const cached = await AsyncStorage.getItem("chatData");
        if (cached) {
          setData(JSON.parse(cached));
        }
      } catch (error) {
        console.error("Failed to get cached data:", error);
      }
    };
    getCachedData();
  }, []);

  // 2. Filter data based on search
  const filteredData = Data
    ? Data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: backgroundColor }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            padding: 10,
          }}
          placeholder={"Search Calls"}
          value={search}
          onChangeText={setSearch} // 3. Update search state
        />
        <TouchableOpacity style={{ padding: 10 }}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <CustomText style={{}}>Recent calls</CustomText>
      <FlatList
        data={filteredData} // 4. Use filtered data
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ChatlistTile
            isChat={false}
            User={item.name}
            Message={item.address.geo.lat}
            onPress={() => router.push("/ChatPage")}
          />
        )}
      />
    </View>
  );
};

export default Calls;

const styles = StyleSheet.create({});
