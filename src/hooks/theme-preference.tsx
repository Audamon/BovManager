import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "bovmanager_theme_preference";

export type ThemePreference = "system" | "light" | "dark";

interface ThemePreferenceContextValue {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const ThemePreferenceContext = createContext<ThemePreferenceContextValue>({
  preference: "system",
  setPreference: () => {},
});

export const ThemePreferenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    SecureStore.getItemAsync(STORAGE_KEY).then((value) => {
      if (value === "light" || value === "dark" || value === "system") {
        setPreferenceState(value);
      }
    });
  }, []);

  const setPreference = (value: ThemePreference) => {
    setPreferenceState(value);
    SecureStore.setItemAsync(STORAGE_KEY, value);
  };

  return (
    <ThemePreferenceContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
};

export const useThemePreference = () => useContext(ThemePreferenceContext);
