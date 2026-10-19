import { Theme } from "@/constants/theme";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BODY_EDGE = "#8a949c";
const GRAPHITE = "#2b3440";

export type Drawer = {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
};

/** Crisper drawers double as the expiry filters. */
function Crisper({ drawers }: { drawers: Drawer[] }) {
  return (
    <View style={styles.crisperRow}>
      {drawers.map((d) => (
        <Pressable
          key={d.label}
          onPress={d.onPress}
          accessibilityRole="button"
          accessibilityState={{ selected: d.active }}
          accessibilityLabel={`${d.label}: ${d.count}`}
          style={({ pressed }) => [
            styles.drawer,
            d.active && styles.drawerActive,
            pressed && styles.pressed,
          ]}
        >
          <View style={[styles.handle, d.active && styles.handleActive]} />
          <Text style={[styles.drawerText, d.active && styles.drawerTextActive]}>
            {d.count} {d.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

type ItemLayoutProps = {
  /** Control display at the top of the fridge */
  header: React.ReactNode;
  children: React.ReactNode;
  drawers: Drawer[];
};

export function ItemLayout({ header, children, drawers }: ItemLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + Theme.spacing.sm }]}>
      <View style={styles.body}>
        {/* Slim graphite bar handle down the right edge */}
        <View style={styles.barHandle} />

        {header}

        <View style={styles.interior}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>

        <Crisper drawers={drawers} />
      </View>
      <View style={styles.floorShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.background,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  // Satin white-steel body, tinted shadow
  body: {
    flex: 1,
    borderRadius: 28,
    padding: 12,
    paddingRight: 28,
    gap: 8,
    backgroundColor: "#b8c0c7",
    experimental_backgroundImage: "linear-gradient(180deg, #e6eaee, #bcc4cb 45%, #a3adb5)",
    borderWidth: 2,
    borderColor: BODY_EDGE,
    boxShadow: [
      { offsetX: 0, offsetY: 16, blurRadius: 28, color: "rgba(40,50,60,0.4)" },
      { offsetX: 0, offsetY: 2, blurRadius: 0, color: "rgba(255,255,255,0.6)", inset: true },
    ],
  },
  barHandle: {
    position: "absolute",
    right: 9,
    top: "18%",
    bottom: "26%",
    width: 8,
    borderRadius: 4,
    backgroundColor: GRAPHITE,
  },
  interior: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#e6ecf0",
    backgroundColor: "#f5fcff",
    boxShadow: [
      { offsetX: 0, offsetY: 6, blurRadius: 12, color: "rgba(30,70,90,0.25)", inset: true },
    ],
  },
  content: {
    paddingBottom: Theme.spacing.lg,
  },
  crisperRow: {
    flexDirection: "row",
    gap: 8,
  },
  drawer: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    backgroundColor: "#ffffff",
    boxShadow: [
      { offsetX: 0, offsetY: 2, blurRadius: 6, color: "rgba(30,70,90,0.12)" },
    ],
  },
  drawerActive: {
    backgroundColor: Theme.contrast,
    borderColor: "#e4572f",
  },
  handle: {
    width: "45%",
    height: 4,
    borderRadius: 2,
    backgroundColor: GRAPHITE,
    opacity: 0.8,
  },
  handleActive: {
    backgroundColor: "#ffffff",
  },
  drawerText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: "700",
    color: GRAPHITE,
  },
  drawerTextActive: {
    color: Theme.textInverted,
  },
  pressed: {
    opacity: 0.6,
  },
  floorShadow: {
    alignSelf: "center",
    width: "80%",
    height: 8,
    marginTop: 4,
    borderRadius: 4,
    backgroundColor: "rgba(60,70,140,0.18)",
  },
});
