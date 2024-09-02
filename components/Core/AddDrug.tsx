import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { useNavigation } from "expo-router";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign, Feather, Octicons } from "@expo/vector-icons";
import { useDrugContext } from "@/store/drugStore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const { addDrug } = useDrugContext();
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const { goBack } = useNavigation();

  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    reminders: [
      {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes(),
        taken: false,
      },
    ],
  });

  async function scheduleDailyNotification({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Meditrack",
        body: `It's time 🕒 to take your medication. ${formData.dosage} of ${formData.name} `,
        priority: Notifications.AndroidNotificationPriority.MAX,
        sound: true,
        vibrate: [0, 250, 250, 250],
      },

      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }
  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addNewReminder = () => {
    setFormData((prev) => ({
      ...prev,
      reminders: [
        ...prev.reminders,
        {
          hours: new Date().getHours(),
          minutes: new Date().getMinutes(),
          taken: false,
        },
      ],
    }));
  };

  const saveDrug = async () => {
    if (!formData.name || !formData.dosage || !formData.reminders.length) {
      alert("Please fill all fields");
      return;
    }
    await addDrug(formData);
    // Schedule notifications for each reminder
    formData.reminders.forEach(async (reminder) => {
      try {
        await scheduleDailyNotification({
          hours: reminder.hours,
          minutes: reminder.minutes,
        });
      } catch (error) {
        alert("Error scheduling notification for " + formData.name);
      }
    });
    setFormData({
      name: "",
      dosage: "",
      reminders: [],
    });
    alert("Drug added successfully");
  };

  const [activeReminderIndex, setActiveReminderIndex] = useState<number | null>(
    null
  );

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    index: number
  ) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setFormData((prev) => ({
        ...prev,
        reminders: prev.reminders.map((r, i) =>
          i === index
            ? {
                ...r,
                hours: currentDate.getHours(),
                minutes: currentDate.getMinutes(),
              }
            : r
        ),
      }));
    }
    setShow(false);
    setActiveReminderIndex(null);
  };

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

            <TextInput
              className=" w-full p-2 "
              placeholder="Enter drug name"
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          </View>
        </View>
        <View>
          <Text>Dosage & Frequency</Text>
          <View className="flex-row justify-between">
            <View className="flex-row  h-14 space-x-1 bg-neutral px-3 mt-2 rounded-2xl items-center">
              <TextInput
                className=" w-full p-2 "
                placeholder="Enter dosage"
                value={formData.dosage}
                onChangeText={(text) => handleChange("dosage", text)}
              />
            </View>
          </View>
        </View>
        <View>
          <Text>Reminders</Text>
          <View>
            {formData.reminders.map((reminder, index) => (
              <View
                className="flex-row justify-between my-3 items-center"
                key={index}
              >
                {show && activeReminderIndex === index && (
                  <RNDateTimePicker
                    value={new Date(0, 0, 0, reminder.hours, reminder.minutes)}
                    mode="time"
                    display="default"
                    onChange={(event, selectedDate) =>
                      handleDateChange(event, selectedDate, index)
                    }
                  />
                )}
                <TouchableOpacity
                  onPress={() => {
                    setShow(true);
                    setActiveReminderIndex(index);
                  }}
                >
                  <Text className="text-base">
                    {`${reminder.hours
                      .toString()
                      .padStart(2, "0")}:${reminder.minutes
                      .toString()
                      .padStart(2, "0")}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      reminders: prev.reminders.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Octicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={addNewReminder}
              className="my-4 h-10 w-10 bg-green-50 items-center rounded-xl justify-center"
            >
              <Feather name="plus" size={14} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="bg-green-500 absolute bottom-10 w-full  h-14 items-center justify-center rounded-2xl"
        onPress={saveDrug}
      >
        <Text className="text-white font-semibold">Done</Text>
      </TouchableOpacity>
    </View>
  );
}
