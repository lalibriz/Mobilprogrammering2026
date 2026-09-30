import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import { expiryStatus } from "@/utils/expiry";
import { StyleSheet, Text, View } from "react-native";

type FridgeHeaderProps = {
  items: Item[];
};

export function FridgeHeader({ items }: FridgeHeaderProps) {
  const soon = items.filter((i) => expiryStatus(i.expiresAt) === "soon").length;
  const expired = items.filter(
    (i) => expiryStatus(i.expiresAt) === "expired",
  ).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mitt kjøleskap</Text>
      <View style={styles.stats}>
        <Stat value={items.length} label="varer" />
        <Stat value={soon} label="går snart ut" />
        <Stat value={expired} label="utgått" />
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
