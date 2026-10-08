import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import { expiryLabel, expiryStatus, type ExpiryStatus } from "@/utils/expiry";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ItemCardProps = {
  item: Item;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
};

const BADGE: Record<ExpiryStatus, { bg: string; fg: string }> = {
  expired: { bg: Theme.dangerLight, fg: Theme.danger },
  soon: { bg: Theme.warningLight, fg: "#b45309" },
  fresh: { bg: Theme.successLight, fg: Theme.success },
};

export function ItemCard({ item, onEdit, onRemove }: ItemCardProps) {
  const { id, name, quantity, expiresAt } = item;
  const colors = BADGE[expiryStatus(expiresAt)];

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>
          {name} <Text style={styles.quantity}>× {quantity}</Text>
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.badgeText, { color: colors.fg }]}>
            {expiryLabel(expiresAt)}
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel={`Rediger ${name}`}
        onPress={() => onEdit(id)}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Icon name="edit" size={20} color={Theme.muted} />
      </Pressable>
      <Pressable
        accessibilityLabel={`Fjern ${name}`}
        onPress={() => onRemove(id)}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Icon name="remove" size={20} color={Theme.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.surface,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  info: {
    flex: 1,
    gap: Theme.spacing.xs,
    alignItems: "flex-start",
  },
  name: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "600",
    color: Theme.text,
  },
  quantity: {
    fontSize: Theme.fontSize.md,
    fontWeight: "400",
    color: Theme.muted,
  },
  badge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.radius.lg,
  },
  badgeText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: "600",
  },
  action: {
    padding: Theme.spacing.sm,
  },
  pressed: {
    opacity: 0.5,
  },
});
