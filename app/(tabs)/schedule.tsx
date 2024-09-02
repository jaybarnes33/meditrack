import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";

import { Drug, useDrugContext } from "@/store/drugStore";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AddButton from "@/components/Core/AddButton";
const ReviewList = () => {
  const navigation = useNavigation();
  const { drugs, isReminderTaken } = useDrugContext();
  const renderItem = ({ item, index }: { item: Drug; index: number }) => (
    <View
      key={index}
      className="flex-row space-x-5 items-center p-3 px-8  bg-neutral rounded-3xl "
    >
      <Image
        className="w-7 h-7"
        source={require("@/assets/images/drugs.png")}
      />
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
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-xl my-4 font-bold text-center">
        Your medications
      </Text>
      <FlatList
        data={drugs}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <AddButton />
    </SafeAreaView>
  );
};

export default ReviewList;
