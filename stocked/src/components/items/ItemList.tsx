import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import {
  daysUntilExpiry,
  expiryStatus,
  type ExpiryStatus,
} from "@/utils/expiry";
import type { Item } from "@/utils/item-schema";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ItemCard } from "./ItemCard";

type ItemListProps = {
  items: Item[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  activeFilters?: ExpiryStatus[];
};

export function ItemList({
  items,
  onEdit,
  onRemove,
  onAdd,
  activeFilters = [],
}: ItemListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="fridge" size={40} color={Theme.muted} />
        <Text style={styles.emptyText}>Kjøleskapet er tomt</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() => onAdd()}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Legg til første vare</Text>
        </Pressable>
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
    gap: Theme.spacing.md,
  },
  empty: {
    alignItems: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.xl,
    borderRadius: Theme.radius.xl,
    backgroundColor: Theme.surface,
    boxShadow: Theme.shadow.card,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    color: Theme.muted,
  },
  button: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: 24,
    backgroundColor: Theme.contrast,
    boxShadow: Theme.shadow.button,
  },
  buttonText: {
    fontSize: Theme.fontSize.md,
    fontWeight: "700",
    color: Theme.textInverted,
  },
  pressed: {
    opacity: 0.7,
  },
});
