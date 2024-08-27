import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import ReviewList from "@/components/Core/ReviewList";

const index = () => {
  return (
    <SafeAreaView className="px-5  space-y-4 bg-white flex-1">
      {/* Intro */}

      <View className="flex-row space-x-2 items-center px-2 bg-neutral rounded-xl mb-3">
        <Feather name="search" size={20} color={"grey"} />
        <TextInput placeholder="Search" className="h-12" />
      </View>
      <View>
        <Text className="font-bold text-xl">Hello,</Text>
        <Text className="text-2xl font-light">Raymond</Text>
      </View>

      <View className="p-5 flex-row rounded-3xl bg-accent relative h-[20vh]">
        <View className="space-y-3">
          <Text className="font-bold text-xl w-28">Your plan for today</Text>
          <Text>2 of 4 completed</Text>
          <TouchableOpacity className="absolute bottom-2 border-tomato border-b pb-1">
            <Text className="text-tomato font-semibold  ">Show more</Text>
          </TouchableOpacity>
        </View>
        <View className="absolute  -top-20 -right-5">
          <Image source={require("@/assets/images/home.png")} />
        </View>
      </View>

      <ReviewList />
    </SafeAreaView>
  );
};

export default index;
