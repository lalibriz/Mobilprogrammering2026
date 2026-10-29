import { Pressable, StyleSheet, Text, View } from "react-native";

import { Theme } from "@/constants/theme";
import {
  ShoppingItem,
  ShoppingItemData,
} from "./ShoppingItem";

type Props = {
  items: ShoppingItemData[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function ShoppingList({
  items,
  onToggle,
  onRemove,
  onClear,
}: Props) {
  const remaining = items.filter(
    (item) => !item.checked
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Min handleliste</Text>
        <Text style={styles.count}>{remaining} igjen</Text>
      </View>


{items.length === 0 ? (
  <View style={styles.empty}>
    <Text style={styles.emptyTitle}>
      Handlelisten er tom
    </Text>
    <Text style={styles.emptyText}>
      Søk etter en vare ovenfor for å legge den til.
    </Text>
  </View>
) : (
  <>
    <View style={styles.list}>
      {items.map((item) => (
        <ShoppingItem
          key={item.id}
          item={item}
          onToggle={onToggle}
          onRemove={onRemove}
        />
      ))}
    </View>

    <Pressable
      style={styles.clearButton}
      onPress={onClear}
      accessibilityRole="button"
      accessibilityLabel="Tøm handleliste"
    >
      <Text style={styles.clearText}>
        Tøm handleliste
      </Text>
    </Pressable>
  </>
)}
</View>
);
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: Theme.text,
    fontSize: Theme.fontSize.lg,
    fontWeight: "700",
  },
  count: {
    color: Theme.primary,
    fontSize: Theme.fontSize.md,
    fontWeight: "600",
  },
  empty: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.xl,
    alignItems: "center",
    gap: Theme.spacing.sm,
  },
  emptyTitle: {
    color: Theme.text,
    fontSize: Theme.fontSize.lg,
    fontWeight: "600",
  },
  emptyText: {
    color: Theme.muted,
    textAlign: "center",
    fontSize: Theme.fontSize.md,
  },
  list: {
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  clearButton: {
  backgroundColor: Theme.surface,
  borderWidth: 1,
  borderColor: Theme.danger,
  borderRadius: Theme.radius.md,
  padding: Theme.spacing.md,
  alignItems: "center",
},

clearText: {
  color: Theme.danger,
  fontWeight: "600",
  fontSize: 15,
},
});
