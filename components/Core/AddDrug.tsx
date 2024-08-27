import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { AntDesign, Feather, Octicons } from "@expo/vector-icons";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const AddDrug = () => {
  const { goBack } = useNavigation();
  return (
    <View className="space-y-6 relative flex-1">
      <TouchableOpacity
        className="h-12 w-12 bg-neutral items-center justify-center rounded-xl"
        onPress={goBack}
      >
        <AntDesign name="arrowleft" size={24} color="grey" />
      </TouchableOpacity>

      <View className="space-y-9">
        <Text className="font-bold text-2xl">Add Drug</Text>

        <View>
          <Text>Drug Name</Text>
          <View className="flex-row h-14 space-x-2 bg-neutral px-5 mt-2 rounded-2xl items-center">
            <Image source={require("@/assets/images/drugs.png")} />

            <TextInput className=" w-full p-2 " placeholder="Enter drug name" />
          </View>
        </View>
        <View>
          <Text>Dosage & Frequency</Text>
          <View className="flex-row justify-between">
            <View className="flex-row w-[43vw] h-14 space-x-1 bg-neutral px-3 mt-2 rounded-2xl items-center">
              <Image source={require("@/assets/images/drugs.png")} />

              <TextInput
                className=" w-full p-2 "
                placeholder="Enter drug name"
              />
            </View>
            <View className="flex-row w-[43vw] h-14 space-x-2 bg-neutral px-5 mt-2 rounded-2xl items-center">
              <AntDesign name="clockcircle" color="gray" />

              <TextInput className=" w-full p-2 " placeholder="Frequency" />
            </View>
          </View>
        </View>
        <View>
          <Text>Reminders</Text>
          <View>
            <View className="flex-row h-14 justify-between space-x-2  px-5 mt-2 rounded-2xl items-center">
              <Octicons name="bell-fill" size={20} color={"grey"} />

              <RNDateTimePicker
                display="inline"
                mode="time"
                value={new Date()}
              />

              <TouchableOpacity className="  h-10 w-10 bg-green-50 items-center rounded-xl justify-center ">
                <Feather name="plus" size={14} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="bg-green-500 absolute bottom-10 w-full  h-14 items-center justify-center rounded-2xl"
        onPress={() => alert("Drug added successfully")}
      >
        <Text className="text-white font-semibold">Done</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddDrug;
