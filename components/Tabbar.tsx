import { View, TouchableOpacity, Image } from "react-native";
import React, { ReactNode } from "react";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const icons: Record<string, [ReactNode, ReactNode]> = {
    index: [
      <Feather name="home" size={20} color="gray" />,
      <Feather name="home" size={20} color="black" />,
    ],
    schedule: [
      <Ionicons name="calendar-clear-outline" size={20} color="gray" />,
      <Ionicons name="calendar-clear" size={20} color="black" />,
    ],
    profile: [
      <FontAwesome5 size={20} name="user" color="gray" />,
      <FontAwesome5 size={20} name="user" variant="Bold" color="black" />,
    ],
    chat: [
      <Ionicons size={20} name="chatbox-ellipses-outline" color="gray" />,
      <Ionicons size={20} name="chatbox-ellipses-sharp" />,
    ],
  };

  return (
    <View className="bg-white   shadow py-2 px-4 fixed">
      <View className="flex-row h-16 items-center">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            navigation.navigate(route.name);
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center" }}
            >
              {!isFocused ? (
                icons[route.name]?.at(0)
              ) : (
                <View className="relative">
                  {icons[route.name]?.at(1)}
                  {isFocused && (
                    <View className="h-1 w-1 mx-auto rounded-full -bottom-2 bg-black " />
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TabBar;
