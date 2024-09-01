import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation, useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Drug, useDrugContext } from "@/store/drugStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const DrugDetails = () => {
  const route = useRoute();
  const { back } = useRouter();

  const {
    params: { index },
  } = route as { params: { drug: Drug; index: number } };

  const { markAsTaken, getNearestReminder, drugs, deleteDrug } =
    useDrugContext();

  const navigation = useNavigation();
  const handleDelete = async () => {
    await deleteDrug(index);
    alert("Drug deleted successfully");
    //@ts-ignore
    navigation.navigate("(tabs)");
  };
  const drug = drugs[index];
  const isWithinAnHour = (reminder: (typeof drug.reminders)[number]) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const reminderTimeInMinutes = reminder.hours * 60 + reminder.minutes;
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    const timeDifference = reminderTimeInMinutes - currentTimeInMinutes;
    return timeDifference >= -60; // Within the past hour or in the future
  };

  const handleTaken = async (drugIndex: number, reminderIndex: number) => {
    const nearestReminder = getNearestReminder(drug) ?? {
      hours: drug.reminders[0].hours,
      minutes: drug.reminders[0].minutes,
    };
    await markAsTaken(drugIndex, reminderIndex);
    alert(
      `You have marked ${drug.name} as taken, next reminder will be at ${nearestReminder.hours}:${nearestReminder.minutes} `
    );
  };

  const isNotClose = (reminder: (typeof drug.reminders)[number]) => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const reminderTimeInMinutes = reminder.hours * 60 + reminder.minutes;
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;

    const timeDifference = reminderTimeInMinutes - currentTimeInMinutes;
    return timeDifference > 30; // More than an hour away
  };

  return (
    <SafeAreaView className="flex-1 px-4 bg-white">
      <TouchableOpacity
        className="h-12 w-12 bg-neutral items-center justify-center rounded-xl"
        onPress={back}
      >
        <AntDesign name="arrowleft" size={24} color="grey" />
      </TouchableOpacity>
      <Text className="text-xl my-3 font-bold">{drug.name}</Text>
      <Text>{drug.dosage}</Text>
      <View className="bg-gray-50 my-4 p-3">
        <Text>Times</Text>
        {drug.reminders.map((reminder, drugIndex) => (
          <View
            key={drugIndex}
            className="flex-row space-x-5 my-3 items-center"
          >
            <Text>
              {`${reminder.hours.toString().padStart(2, "0")}:${reminder.minutes
                .toString()
                .padStart(2, "0")}`}
            </Text>
            <View className="flex-row space-x-1 flex-1">
              <Text>Take</Text>
              <Text className="text-neutral-400 font-bold">{drug.dosage}</Text>
            </View>
            <View>
              {isWithinAnHour(reminder) ? (
                !isNotClose(reminder) ? (
                  <TouchableOpacity
                    disabled={isNotClose(reminder) || reminder.taken}
                    onPress={() => handleTaken(index, drugIndex)}
                  >
                    {!reminder.taken ? (
                      <AntDesign name="check" color={"green"} size={15} />
                    ) : (
                      <Ionicons
                        name="checkmark-done-circle"
                        size={17}
                        color="green"
                      />
                    )}
                  </TouchableOpacity>
                ) : (
                  <Ionicons name="time" color={"grey"} size={15} />
                )
              ) : (
                <AntDesign name="close" color={"red"} size={15} />
              )}
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className="bg-red-500 rounded-xl my-2 items-center p-3"
        onPress={async () => await handleDelete()}
      >
        <Text className="text-gray-50 font-semibold text-base">
          Delete drug
        </Text>
      </TouchableOpacity>
      <Text className="text-red-500">Deletion can't be undone!!</Text>
    </SafeAreaView>
  );
};

export default DrugDetails;
