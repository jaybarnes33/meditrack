import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { sampleMedicines } from "@/constants/data";
import * as SecureStore from "expo-secure-store";
const ReviewList = () => {
  const [drugs, setDrugs] = React.useState([]);

  const fetchDrugs = async () => {
    const drugs = (await SecureStore.getItemAsync("drugs")) || "[]";
    setDrugs(JSON.parse(drugs));
  };
  useEffect(() => {
    (async () => await fetchDrugs())();
  }, []);
  const renderItem = ({
    item,
  }: {
    item: { name: string; dosage: string; reminders: [string] };
  }) => (
    <View className="flex-row space-x-5 items-center p-3 px-8  bg-neutral rounded-3xl ">
      <Image source={require("@/assets/images/drugs.png")} />
      <View className="flex-1">
        <Text className="text-base">{item?.name}</Text>
        <View className="flex-row items-center space-x-2">
          <Text className="text-gray-500">{item?.dosage}</Text>
          <Text className="text-sm text-gray-500">
            {item?.reminders?.length} reminders
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          alert(
            `Name: ${item.name}, Dosage: ${
              item.dosage
            }, Reminders: ${item.reminders.map((item) => item.time)}`
          )
        }
      >
        <AntDesign name="right" size={18} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="mt-4 flex-1 ">
      <Text className="font-semibold text-lg ">Daily Review</Text>

      <FlatList
        data={drugs}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ReviewList;
