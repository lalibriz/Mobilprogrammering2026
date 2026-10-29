import { Theme } from "@/constants/theme";
import { expiryStatus, type ExpiryStatus } from "@/utils/expiry";
import type { Item } from "@/utils/item-schema";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type FilterBarProps = {
  items: Item[];
  activeFilters: ExpiryStatus[];
  onToggle: (status: ExpiryStatus) => void;
  onClear: () => void;
};

const FILTERS: { status: ExpiryStatus; label: string }[] = [
  { status: "fresh", label: "Ferske" },
  { status: "soon", label: "Snart ute" },
  { status: "expired", label: "Utgått" },
];

type ChipProps = {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, count, active, onPress }: ChipProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      <View style={[styles.count, active && styles.countActive]}>
        <Text style={[styles.countText, active && styles.labelActive]}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

export function FilterBar({
  items,
  activeFilters,
  onToggle,
  onClear,
}: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      <Chip
        label="Alle"
        count={items.length}
        active={activeFilters.length === 0}
        onPress={onClear}
      />
      {FILTERS.map(({ status, label }) => (
        <Chip
          key={status}
          label={label}
          count={items.filter((i) => expiryStatus(i.expiresAt) === status).length}
          active={activeFilters.includes(status)}
          onPress={() => onToggle(status)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Luft rundt chipene slik at skyggene ikke klippes av ScrollView
  scroll: {
    flexGrow: 0,
    marginVertical: -Theme.spacing.sm,
  },
  container: {
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.sm,
    paddingLeft: Theme.spacing.lg,
    paddingRight: Theme.spacing.sm,
    borderRadius: 24,
    backgroundColor: Theme.surface,
    boxShadow: Theme.shadow.card,
  },
  chipActive: {
    backgroundColor: Theme.text,
  },
  label: {
    fontSize: Theme.fontSize.md,
    fontWeight: "600",
    color: Theme.text,
  },
  labelActive: {
    color: Theme.textInverted,
  },
  count: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.pill,
  },
  countActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  countText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: "700",
    color: Theme.text,
  },
  pressed: {
    opacity: 0.7,
  },
});
