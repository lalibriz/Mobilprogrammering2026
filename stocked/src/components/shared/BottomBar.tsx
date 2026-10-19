import { Icon, type IconName } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { useItemEditor } from "@/contexts/ItemEditorContext";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BarButtonProps = {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress?: () => void;
};

/** Knappene som ikke har noen funksjon ennå, bruker bare denne uten onPress. */
function BarButton({ icon, label, active = false, onPress }: BarButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      {({ pressed }) => (
        <View style={[styles.bubble, pressed && styles.pressed]}>
          {/* Always mounted and only faded: adding a shadow to an existing
              rounded view drops its corners on Android */}
          <View style={[styles.bubbleActive, { opacity: active ? 1 : 0 }]} />
          <Icon
            name={icon}
            size={24}
            color={active ? Theme.primary : Theme.muted}
          />
        </View>
      )}
    </Pressable>
  );
}

export function BottomBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { openAdd } = useItemEditor();

  return (
    <View
      style={[styles.bar, { paddingBottom: insets.bottom + Theme.spacing.sm }]}
    >
      <View style={styles.pill}>
        <BarButton
          icon="fridge"
          label="Hjem"
          active={pathname === "/"}
          onPress={() => router.navigate("/")}
        />
        <BarButton icon="cart" label="Handleliste (kommer)" />
      </View>

      <Pressable
        style={({ pressed }) => [styles.add, pressed && styles.pressed]}
        onPress={() => openAdd()}
        accessibilityRole="button"
        accessibilityLabel="Legg til vare"
      >
        <Icon name="add" size={30} color={Theme.textInverted} />
      </Pressable>

      <View style={styles.pill}>
        <BarButton icon="recipes" label="Oppskrifter (kommer)" />
        <BarButton icon="settings" label="Innstillinger (kommer)" />
      </View>
    </View>
  );
}

const SIZE = 56;

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.background,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    padding: Theme.spacing.xs,
    borderRadius: 40,
    backgroundColor: Theme.pill,
    boxShadow: [
      { offsetX: 0, offsetY: 6, blurRadius: 16, color: "rgba(60,70,140,0.2)" },
      { offsetX: 0, offsetY: 2, blurRadius: 4, color: "rgba(60,70,140,0.18)", inset: true },
    ],
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  bubble: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleActive: {
    ...StyleSheet.absoluteFill,
    borderRadius: SIZE / 2,
    backgroundColor: Theme.raised,
    boxShadow: [
      { offsetX: 0, offsetY: 4, blurRadius: 10, color: "rgba(60,70,140,0.3)" },
    ],
  },
  add: {
    width: SIZE + 8,
    height: SIZE + 8,
    borderRadius: (SIZE + 8) / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.contrast,
    boxShadow: [
      { offsetX: 0, offsetY: 8, blurRadius: 16, color: "rgba(255,122,89,0.45)" },
    ],
  },
  pressed: {
    opacity: 0.6,
  },
});
