import { DarkTheme, LightTheme, type ThemeType } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useEffect, useMemo, useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export type ThemeMode = "system" | "light" | "dark";

type ThemeContextData = {
  theme: ThemeType;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextData | null>(null);

export const THEME_STORAGE_KEY = "stocked:theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (saved === "light" || saved === "dark" || saved === "system") {
          setModeState(saved);
        }
      })
      .catch((error) => console.error("Kunne ikke hente tema:", error))
      .finally(() => setLoaded(true));
  }, []);

  function setMode(next: ThemeMode) {
    setModeState(next);
    AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch((error) =>
      console.error("Kunne ikke lagre tema:", error),
    );
  }

  const isDark = mode === "system" ? system === "dark" : mode === "dark";
  const theme = isDark ? DarkTheme : LightTheme;

  // Unngå et lyst glimt før valgt tema er lest
  if (!loaded) return null;

  return (
    <ThemeContext value={{ theme, isDark, mode, setMode }}>
      {children}
    </ThemeContext>
  );
}

export function useThemeSettings() {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error("useThemeSettings must be used within a ThemeProvider");
  }

  return context;
}

export function useTheme() {
  return useThemeSettings().theme;
}

/**
 * Som StyleSheet.create, men fargene hentes fra aktivt tema. Bruk:
 *   const useStyles = makeStyles((Theme) => ({ ... }));
 *   const styles = useStyles();
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(
  create: (theme: ThemeType) => T,
) {
  return function useStyles() {
    const theme = useTheme();

    return useMemo(() => StyleSheet.create(create(theme)), [theme]);
  };
}
