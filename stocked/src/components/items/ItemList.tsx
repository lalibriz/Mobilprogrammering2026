import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import {
  daysUntilExpiry,
  expiryStatus,
  type ExpiryStatus,
} from "@/utils/expiry";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ItemCard } from "./ItemCard";

type ItemListProps = {
  items: Item[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  activeFilters?: ExpiryStatus[];
};

const PER_SHELF = 3;
const MIN_SHELVES = 4; // empty shelves keep it looking like a fridge

export function ItemList({
  items,
  onEdit,
  onRemove,
  onAdd,
  activeFilters = [],
}: ItemListProps) {
  // Ingen aktive filtre betyr at alle varer vises
  const visible =
    activeFilters.length === 0
      ? items
      : items.filter((i) => activeFilters.includes(expiryStatus(i.expiresAt)));

  // Varene som går ut først ligger øverst
  const sorted = [...visible].sort(
    (a, b) => daysUntilExpiry(a.expiresAt) - daysUntilExpiry(b.expiresAt),
  );

  const shelves: Item[][] = [];
  for (let i = 0; i < sorted.length; i += PER_SHELF) {
    shelves.push(sorted.slice(i, i + PER_SHELF));
  }
  while (shelves.length < MIN_SHELVES) shelves.push([]);

  const emptyMessage =
    items.length === 0 ? null : visible.length === 0 ? "Ingen varer matcher filteret" : undefined;

  return (
    <View>
      {shelves.map((row, index) => (
        <View key={index} style={styles.shelf}>
          <View style={styles.row}>
            {index === 0 && emptyMessage !== undefined ? (
              <View style={styles.empty}>
                <Icon name="fridge" size={40} color={Theme.muted} />
                <Text style={styles.emptyText}>
                  {emptyMessage ?? "Kjøleskapet er tomt"}
                </Text>
                {emptyMessage === null && (
                  <Pressable
                    onPress={() => onAdd()}
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
                  >
                    <Text style={styles.ctaText}>Legg til første vare</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <>
                {row.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onRemove={onRemove}
                  />
                ))}
                {/* Keep a short row's items on the left, same width as full rows */}
                {Array.from({ length: PER_SHELF - row.length }, (_, i) => (
                  <View key={`pad${i}`} style={styles.pad} />
                ))}
              </>
            )}
          </View>
          <View style={styles.glass} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: {
    minHeight: 136,
    justifyContent: "flex-end",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Theme.spacing.sm,
    paddingBottom: 2,
  },
  pad: {
    flex: 1,
  },
  // Glass shelf: bright front edge, soft shadow falling onto the shelf below
  glass: {
    height: 12,
    backgroundColor: "#c4eef5",
    experimental_backgroundImage:
      "linear-gradient(180deg, #ffffff, #c4eef5 55%, #8fdbe8)",
    borderTopWidth: 1,
    borderTopColor: "#ffffff",
    borderBottomWidth: 2,
    borderBottomColor: "#6cc3d4",
    boxShadow: [
      { offsetX: 0, offsetY: 8, blurRadius: 10, color: "rgba(40,150,180,0.3)" },
    ],
  },
  empty: {
    flex: 1,
    alignItems: "center",
    gap: Theme.spacing.sm,
    paddingVertical: Theme.spacing.md,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    color: Theme.muted,
  },
  cta: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.primary,
  },
  ctaText: {
    fontSize: Theme.fontSize.md,
    fontWeight: "600",
    color: Theme.textInverted,
  },
  pressed: {
    opacity: 0.6,
  },
});
