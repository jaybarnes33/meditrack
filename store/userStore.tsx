import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";

interface User {
  name: string;
  username: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => Promise<void>;
  getUser: () => Promise<User | null>;
  clearUser: () => Promise<void>;
}

const UserContext = createContext<UserStore | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      if (storedUser) {
        setUserState(storedUser);
      }
    };
    loadUser();
  }, []);

  const setUser = async (user: User) => {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    setUserState(user);
  };

  const getUser = async (): Promise<User | null> => {
    const userString = await SecureStore.getItemAsync("user");
    return userString ? JSON.parse(userString) : null;
  };

  const clearUser = async () => {
    await SecureStore.deleteItemAsync("user");
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, getUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserStore => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
