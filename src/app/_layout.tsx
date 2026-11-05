import { Loading } from "@/components/shared/Loading";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ItemEditorProvider } from "@/contexts/ItemEditorContext";
import { ItemsProvider } from "@/contexts/ItemsContext";
import { ShoppingProvider } from "@/contexts/ShoppingContext";
import { ThemeProvider, useThemeSettings } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

function Shell() {
  const { theme, isDark } = useThemeSettings();
  const { user, ready } = useAuth();

  if (!ready) return <Loading />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" />
        </Stack.Protected>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="scanner" />
          <Stack.Screen name="recipes" />
        </Stack.Protected>
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ItemsProvider>
            <ShoppingProvider>
              <ItemEditorProvider>
                <Shell />
              </ItemEditorProvider>
            </ShoppingProvider>
          </ItemsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
