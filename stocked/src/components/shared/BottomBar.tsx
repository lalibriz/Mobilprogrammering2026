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
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Icon
        name={icon}
        size={26}
        color={active ? Theme.primary : Theme.muted}
      />
      <Text style={[styles.label, active && styles.active]}>{label}</Text>
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
      <BarButton
        icon="fridge"
        label="Hjem"
        active={pathname === "/"}
        onPress={() => router.navigate("/")}
      />
      <BarButton icon="cart" label="Kommer" />

      <View style={styles.addSlot}>
        <Pressable
          style={({ pressed }) => [styles.add, pressed && styles.pressed]}
          onPress={openAdd}
          accessibilityRole="button"
          accessibilityLabel="Legg til vare"
        >
          <Icon name="add" size={30} color={Theme.textInverted} />
        </Pressable>
      </View>

      <BarButton icon="recipes" label="Kommer" />
      <BarButton icon="settings" label="Kommer" />
    </View>
  );
}

// Alle plassene er like høye, slik at ikonene og + deler samme midtlinje
const SLOT_HEIGHT = 60;

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Theme.spacing.sm,
    backgroundColor: Theme.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.border,
  },
  button: {
    flex: 1,
    height: SLOT_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    color: Theme.muted,
  },
  active: {
    color: Theme.primary,
  },
  addSlot: {
    flex: 1,
    height: SLOT_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.primary,
  },
  pressed: {
    opacity: 0.6,
  },
});
