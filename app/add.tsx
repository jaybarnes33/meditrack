import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AddDrug from "@/components/Core/AddDrug";

const add = () => {
  return (
    <SafeAreaView className="px-5 bg-white flex-1">
      <AddDrug />
    </SafeAreaView>
  );
};

export default add;
