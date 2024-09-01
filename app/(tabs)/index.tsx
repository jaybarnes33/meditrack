import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import ReviewList from "@/components/Core/ReviewList";
import { useUser } from "@/store/userStore";
import AddButton from "@/components/Core/AddButton";

const Index = () => {
  const { user } = useUser();
  return (
    <SafeAreaView className="px-5  space-y-4 bg-white flex-1">
      {/* Intro */}

      <View>
        <Text className="font-bold text-xl">Hello,</Text>
        <Text className="text-2xl font-light">
          {user?.username ?? user?.name.split(" ")[0]}
        </Text>
      </View>

      <View className="p-5 flex-row items-center rounded-3xl bg-accent relative h-[20vh]">
        <View className="space-y-3">
          <Text className="font-bold text-2xl w-28">Your plan for today</Text>
        </View>
        <View className="absolute  -top-20 -right-5">
          <Image source={require("@/assets/images/home.png")} />
        </View>
      </View>

      <ReviewList />
      <AddButton />
    </SafeAreaView>
  );
};

export default Index;
