import { BottomBar } from "@/components/shared/BottomBar";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomBar />}
      screenOptions={{ headerShown: false }}
    />
  );
}
