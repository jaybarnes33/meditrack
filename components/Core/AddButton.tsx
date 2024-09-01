import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const AddButton = () => {
  const { navigate } = useNavigation();
  return (
    <TouchableOpacity
      className="w-12 h-12 bg-green-500 absolute right-8 items-center justify-center rounded-full shadow  bottom-12"
      //@ts-ignore
      onPress={() => navigate("add")}
    >
      <Ionicons name="add" size={28} color={"white"} />
    </TouchableOpacity>
  );
};

export default AddButton;
