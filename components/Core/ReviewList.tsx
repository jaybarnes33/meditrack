import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { sampleMedicines } from "@/constants/data";

const ReviewList = () => {
  const renderItem = ({ item }: { item: (typeof sampleMedicines)[number] }) => (
    <View className="flex-row space-x-5 items-center p-3 px-8  bg-neutral rounded-3xl ">
      <Image source={require("@/assets/images/drugs.png")} />
      <View className="flex-1">
        <Text className="text-base">{item.name}</Text>
        <View className="flex-row space-x-2">
          <Text className="text-gray-600">{item.time}</Text>
          <Text className={`${item.taken ? "text-green-500" : "text-red-500"}`}>
            {item.taken ? "Taken" : "Not Taken"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => alert(`Viewing details for ${item.name}`)}
      >
        <AntDesign name="right" size={18} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="mt-4 flex-1 ">
      <Text className="font-semibold text-lg ">Daily Review</Text>

      <FlatList
        data={sampleMedicines}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ReviewList;
