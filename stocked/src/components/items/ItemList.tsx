import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import { daysUntilExpiry } from "@/utils/expiry";
import { StyleSheet, Text, View } from "react-native";
import { ItemCard } from "./ItemCard";

type ItemListProps = {
  items: Item[];
  onRemove: (id: string) => void;
};

export function ItemList({ items, onRemove }: ItemListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Kjøleskapet er tomt</Text>
      </View>
    );
  }

  // Varene som går ut først ligger øverst
  const sorted = [...items].sort(
    (a, b) => daysUntilExpiry(a.expiresAt) - daysUntilExpiry(b.expiresAt),
  );

  return (
    <View style={styles.container}>
      {sorted.map((item) => (
        <ItemCard key={item.id} item={item} onRemove={onRemove} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.sm,
  },
  empty: {
    alignItems: "center",
    padding: Theme.spacing.xl,
    gap: Theme.spacing.sm,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    color: Theme.muted,
  },
});
