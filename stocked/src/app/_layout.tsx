import { ItemsProvider } from "@/contexts/ItemsContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ItemsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ItemsProvider>
  );
}
