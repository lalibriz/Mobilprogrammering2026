import { Icon } from "@/components/shared/Icon";
import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import {
  daysUntilExpiry,
  expiryStatus,
  type ExpiryStatus,
} from "@/utils/expiry";
import type { Item } from "@/utils/item-schema";
import { useContentStyle } from "./ItemLayout";
import { FlatList, Pressable, Text, View, useWindowDimensions } from "react-native";
import { ItemCard } from "./ItemCard";

type ItemListProps = {
  items: Item[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  activeFilters?: ExpiryStatus[];
  /** Søketekst; varer vises bare hvis navnet inneholder den. */
  query?: string;
  /** Vises over listen, og scroller med den. */
  header?: React.ReactElement;
};

export function ItemList({
  items,
  onEdit,
  onRemove,
  onAdd,
  activeFilters = [],
  query = "",
  header,
}: ItemListProps) {
  const styles = useStyles();
  const Theme = useTheme();
  const content = useContentStyle();
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 2 : 1;

  const needle = query.trim().toLowerCase();
  const visible = items.filter(
    (i) =>
      (activeFilters.length === 0 ||
        activeFilters.includes(expiryStatus(i.expiresAt))) &&
      i.name.toLowerCase().includes(needle),
  );

  // Varene som går ut først ligger øverst
  const sorted = [...visible].sort(
    (a, b) => daysUntilExpiry(a.expiresAt) - daysUntilExpiry(b.expiresAt),
  );

  const empty =
    items.length === 0 ? (
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
    ) : (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Ingen varer matcher søket eller filteret</Text>
      </View>
    );

  return (
    <FlatList
      key={columns}
      data={sorted}
      keyExtractor={(item) => item.id}
      numColumns={columns}
      style={styles.list}
      contentContainerStyle={[content, styles.container]}
      columnWrapperStyle={columns > 1 ? styles.column : undefined}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <ItemCard item={item} onEdit={onEdit} onRemove={onRemove} />
        </View>
      )}
    />
  );
}

const useStyles = makeStyles((Theme) => ({
  list: { flex: 1, backgroundColor: Theme.background },
  container: {
    gap: Theme.spacing.md,
  },
  column: { gap: Theme.spacing.md },
  cell: { flex: 1 },
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
}));
