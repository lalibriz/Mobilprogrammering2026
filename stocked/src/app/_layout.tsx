import { BottomBar } from "@/components/shared/BottomBar";
import { ItemEditorProvider } from "@/contexts/ItemEditorContext";
import { ItemsProvider } from "@/contexts/ItemsContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <ItemsProvider>
      <ItemEditorProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
          <BottomBar />
        </View>
      </ItemEditorProvider>
    </ItemsProvider>
  );
}
