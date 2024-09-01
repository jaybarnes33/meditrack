import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";

interface Reminder {
  hours: number;
  minutes: number;
  taken: boolean;
}

export interface Drug {
  name: string;
  dosage: string;
  reminders: Reminder[];
}

interface DrugContextType {
  drugs: Drug[];
  loadDrugs: () => Promise<void>;
  addDrug: (drug: Drug) => Promise<void>;
  deleteDrug: (index: number) => Promise<void>;
  isReminderTaken: (drugIndex: number, reminderIndex: number) => boolean;
  getDrugsForToday: () => Drug[];
  resetTakenStatus: () => Promise<void>;
  markAsTaken: (drugIndex: number, reminderIndex: number) => Promise<void>;
  getNearestReminder: (drug: Drug) => Reminder;
}

const DrugContext = createContext<DrugContextType | undefined>(undefined);

export const DrugProvider = ({ children }: { children: ReactNode }) => {
  const [drugs, setDrugs] = useState<Drug[]>([]);

  const loadDrugs = async () => {
    const storedDrugs = (await SecureStore.getItemAsync("drugs")) || "[]";
    setDrugs(JSON.parse(storedDrugs));
  };

  const addDrug = async (drug: Drug) => {
    const updatedDrugs = [...drugs, drug];
    setDrugs(updatedDrugs);
    await SecureStore.setItemAsync("drugs", JSON.stringify(updatedDrugs));
  };

  const deleteDrug = async (index: number) => {
    const updatedDrugs = drugs.filter((_, i) => i !== index);
    setDrugs(updatedDrugs);
    await SecureStore.setItemAsync("drugs", JSON.stringify(updatedDrugs));
  };

  const isReminderTaken = (
    drugIndex: number,
    reminderIndex: number
  ): boolean => {
    const drug = drugs[drugIndex];
    const reminder = drug?.reminders[reminderIndex];
    return reminder ? reminder.taken : false;
  };

  const getDrugsForToday = (): Drug[] => {
    const now = new Date();
    return drugs.filter((drug) =>
      drug.reminders?.some(
        (reminder) =>
          reminder.hours > now.getHours() ||
          (reminder.hours >= now.getHours() &&
            reminder.minutes >= now.getMinutes())
      )
    );
  };

  const markAsTaken = async (drugIndex: number, reminderIndex: number) => {
    const updatedDrugs = drugs.map((drug, i) => {
      if (i === drugIndex) {
        return {
          ...drug,
          reminders: drug.reminders.map((reminder, j) => {
            if (j === reminderIndex) {
              return {
                ...reminder,
                taken: true,
              };
            }
            return reminder;
          }),
        };
      }
      return drug;
    });
    setDrugs(updatedDrugs);
    await SecureStore.setItemAsync("drugs", JSON.stringify(updatedDrugs));
  };

  const resetTakenStatus = async () => {
    const updatedDrugs = drugs.map((drug) => ({
      ...drug,
      reminders: drug.reminders.map((reminder) => ({
        ...reminder,
        taken: false,
      })),
    }));
    setDrugs(updatedDrugs);
    await SecureStore.setItemAsync("drugs", JSON.stringify(updatedDrugs));
  };

  const getNearestReminder = (drug: Drug) => {
    const now = new Date();
    const reminders = drug?.reminders?.filter(
      (reminder) =>
        reminder.hours > now.getHours() ||
        (reminder.hours > now.getHours() && reminder.minutes > now.getMinutes())
    );
    return reminders[0];
  };

  useEffect(() => {
    loadDrugs();
    const interval = setInterval(() => {
      resetTakenStatus();
    }, 24 * 60 * 60 * 1000); // Reset every 24 hours
    return () => clearInterval(interval);
  }, []);

  return (
    <DrugContext.Provider
      value={{
        drugs,
        loadDrugs,
        addDrug,
        deleteDrug,
        isReminderTaken,
        getDrugsForToday,
        resetTakenStatus,
        getNearestReminder,
        markAsTaken,
      }}
    >
      {children}
    </DrugContext.Provider>
  );
};

export const useDrugContext = () => {
  const context = useContext(DrugContext);
  if (!context) {
    throw new Error("useDrugContext must be used within a DrugProvider");
  }
  return context;
};
