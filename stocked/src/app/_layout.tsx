import { BottomBar } from "@/components/shared/BottomBar";
import { ItemEditorProvider } from "@/contexts/ItemEditorContext";
import { ItemsProvider } from "@/contexts/ItemsContext";
import { ShoppingProvider } from "@/contexts/ShoppingContext";
import { ThemeProvider, useThemeSettings } from "@/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { View } from "react-native";

function Shell() {
  const { theme, isDark } = useThemeSettings();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
      <BottomBar />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ItemsProvider>
        <ShoppingProvider>
          <ItemEditorProvider>
            <Shell />
          </ItemEditorProvider>
        </ShoppingProvider>
      </ItemsProvider>
    </ThemeProvider>
  );
}
