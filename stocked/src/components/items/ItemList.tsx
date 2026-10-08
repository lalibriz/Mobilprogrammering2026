import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import {
  daysUntilExpiry,
  expiryStatus,
  type ExpiryStatus,
} from "@/utils/expiry";
import { StyleSheet, Text, View } from "react-native";
import { ItemCard } from "./ItemCard";

type ItemListProps = {
  items: Item[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  activeFilters?: ExpiryStatus[];
};

export function ItemList({
  items,
  onEdit,
  onRemove,
  activeFilters = [],
}: ItemListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Kjøleskapet er tomt</Text>
      </View>
    );
  }

  // Ingen aktive filtre betyr at alle varer vises
  const visible =
    activeFilters.length === 0
      ? items
      : items.filter((i) => activeFilters.includes(expiryStatus(i.expiresAt)));

  if (visible.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Ingen varer matcher filteret</Text>
      </View>
    );
  }

  // Varene som går ut først ligger øverst
  const sorted = [...visible].sort(
    (a, b) => daysUntilExpiry(a.expiresAt) - daysUntilExpiry(b.expiresAt),
  );

  return (
    <View style={styles.container}>
      {sorted.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onRemove={onRemove}
        />
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
