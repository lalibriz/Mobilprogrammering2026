import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import { expiryStatus, type ExpiryStatus } from "@/utils/expiry";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FridgeHeaderProps = {
  items: Item[];
  activeFilters: ExpiryStatus[];
  onToggleFilter: (status: ExpiryStatus) => void;
};

export function FridgeHeader({
  items,
  activeFilters,
  onToggleFilter,
}: FridgeHeaderProps) {
  const soon = items.filter((i) => expiryStatus(i.expiresAt) === "soon").length;
  const expired = items.filter(
    (i) => expiryStatus(i.expiresAt) === "expired",
  ).length;

  const fresh = items.length - soon - expired;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mitt kjøleskap</Text>
      <View style={styles.stats}>
        <Stat
          value={fresh}
          label="varer"
          active={activeFilters.includes("fresh")}
          onPress={() => onToggleFilter("fresh")}
        />
        <Stat
          value={soon}
          label="går snart ut"
          active={activeFilters.includes("soon")}
          onPress={() => onToggleFilter("soon")}
        />
        <Stat
          value={expired}
          label="utgått"
          active={activeFilters.includes("expired")}
          onPress={() => onToggleFilter("expired")}
        />
      </View>
    </View>
  );
}

type StatProps = {
  value: number;
  label: string;
  active: boolean;
  onPress: () => void;
};

function Stat({ value, label, active, onPress }: StatProps) {
  return (
    <Pressable
      style={[styles.stat, active && styles.statActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.statValue, active && styles.statTextActive]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, active && styles.statTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.primary,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "700",
    color: Theme.textInverted,
  },
  stats: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  statActive: {
    backgroundColor: Theme.surface,
  },
  statTextActive: {
    color: Theme.primary,
  },
  statValue: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "700",
    color: Theme.textInverted,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.textInverted,
  },
});
