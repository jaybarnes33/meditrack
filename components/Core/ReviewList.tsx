import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";

import { Drug, useDrugContext } from "@/store/drugStore";
import { useNavigation } from "expo-router";
const ReviewList = () => {
  const navigation = useNavigation();
  const { getDrugsForToday, isReminderTaken } = useDrugContext();
  const renderItem = ({ item, index }: { item: Drug; index: number }) => (
    <View
      key={index}
      className="flex-row space-x-5 items-center p-3 px-8  bg-neutral rounded-3xl "
    >
      <Image source={require("@/assets/images/drugs.png")} />
      <View className="flex-1">
        <Text className="text-base">{item?.name}</Text>
        <View className="flex-row items-center space-x-2">
          <Text className="text-gray-500">{item?.dosage}</Text>
          <View>
            <Text className="text-sm text-gray-500">
              {
                item.reminders.filter(
                  (reminder, reminderIndex) =>
                    isReminderTaken(index, reminderIndex) === true
                ).length
              }{" "}
              / {item?.reminders?.length} taken
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        //@ts-ignore
        onPress={() => navigation.navigate("DrugDetails", { index })}
      >
        <AntDesign name="right" size={18} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1">
      <Text className="text-xl my-4 font-bold">Drugs to be taken today:</Text>
      <FlatList
        data={getDrugsForToday()}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ReviewList;
