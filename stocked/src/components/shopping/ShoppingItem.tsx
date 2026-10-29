import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Theme } from "@/constants/theme";

export type ShoppingItemData = {
  id: string;
  name: string;
  checked: boolean;
};

type Props = {
  item: ShoppingItemData;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
};

export function ShoppingItem({
  item,
  onToggle,
  onRemove,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.itemContent}
        onPress={() => onToggle(item.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.checked }}
      >
        <View
          style={[
            styles.checkbox,
            item.checked && styles.checked,
          ]}
        >
          {item.checked && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>

        <Text
          style={[
            styles.name,
            item.checked && styles.completed,
          ]}
        >
          {item.name}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onRemove(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Fjern ${item.name}`}
        style={styles.removeButton}
      >
        <Text style={styles.removeText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Theme.primary,
    borderRadius: Theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: Theme.primary,
  },
  checkmark: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  name: {
    fontSize: 16,
    color: Theme.text,
  },
  completed: {
    textDecorationLine: "line-through",
    color: Theme.muted,
  },
  removeButton: {
    padding: Theme.spacing.sm,
  },
  removeText: {
    color: Theme.danger,
    fontSize: 18,
  },
});
