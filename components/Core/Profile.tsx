import {
  View,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/store/userStore";

const Profile = () => {
  const { setUser, clearUser, user } = useUser();
  const [form, setForm] = useState({
    name: "",
    username: "",
  });

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    await setUser(form);
    alert("Profile details updated successfully");
  };
  return (
    <SafeAreaView className="p-4  h-screen bg-white">
      <View>
        <Text className="text-xl font-bold">Profile</Text>
        <Text>Fill in the details to setup your profile</Text>
      </View>
      <View className="mt-5 space-y-1">
        <Text className="text-sm font-semibold">Full Name</Text>
        <TextInput
          placeholder="John Doe"
          className="bg-green-50 p-3"
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
        />
      </View>
      <View className="mt-5 space-y-1">
        <Text className="text-sm font-semibold">Username</Text>
        <TextInput
          placeholder="John Doe"
          className=" bg-green-50 p-3"
          value={form.username}
          onChangeText={(text) => handleChange("username", text)}
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-green-500 rounded-xl my-4 items-center p-3"
      >
        <Text className="text-gray-50 font-semibold text-base">Save</Text>
      </TouchableOpacity>
      {user && user.name && (
        <TouchableOpacity onPress={clearUser} className=" rounded-xl my-4  p-3">
          <Text className="text-red-500 font-semibold text-base">
            Clear Details
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Profile;
