import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CheckBox = ({
  isCheck,
  setIsCheck,
}: {
  isCheck: boolean;
  setIsCheck: any;
}) => {
  // const [isCheck, setIsCheck] = useState(false);
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={[
          styles.container,
          isCheck && { backgroundColor: "rgba(102, 206, 233, 1)" },
        ]}
        onPress={() => {
          setIsCheck(!isCheck);
        }}
      >
        {isCheck && <Feather name="check" size={25} color={"blue"} />}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setIsCheck(!isCheck);
        }}
      >
        <Text style={{ fontWeight: "500" }}>Remember me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(102, 224, 233, 1)",
  },
});
