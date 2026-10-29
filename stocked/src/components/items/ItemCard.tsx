import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { expiryLabel, expiryStatus, type ExpiryStatus } from "@/utils/expiry";
import type { Item } from "@/utils/item-schema";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ItemCardProps = {
  item: Item;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
};

const COLORS: Record<ExpiryStatus, { accent: string; bg: string; fg: string }> =
  {
    expired: {
      accent: Theme.danger,
      bg: Theme.dangerLight,
      fg: Theme.danger,
    },
    soon: {
      accent: Theme.warning,
      bg: Theme.warningLight,
      fg: Theme.warningDark,
    },
    fresh: {
      accent: Theme.success,
      bg: Theme.successLight,
      fg: Theme.success,
    },
  };

export function ItemCard({ item, onEdit, onRemove }: ItemCardProps) {
  const { id, name, quantity, expiresAt, imageUrl } = item;
  const colors = COLORS[expiryStatus(expiresAt)];

  return (
    <View style={styles.container}>
      <View style={[styles.accent, { backgroundColor: colors.accent }]} />
      <Pressable
        accessibilityLabel={`Rediger ${name}`}
        onPress={() => onEdit(id)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <View style={styles.thumb}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {name} <Text style={styles.quantity}>× {quantity}</Text>
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.badgeText, { color: colors.fg }]}>
              {expiryLabel(expiresAt)}
            </Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel={`Fjern ${name}`}
        onPress={() => onRemove(id)}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
      >
        <Icon name="remove" size={14} color={Theme.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: Theme.radius.xl,
    backgroundColor: Theme.surface,
    boxShadow: Theme.shadow.card,
  },
  accent: {
    alignSelf: "stretch",
    width: 6,
  },
  main: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: Theme.primaryLight,
  },
  image: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  initial: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "700",
    color: Theme.primary,
  },
  info: {
    flex: 1,
    gap: Theme.spacing.xs,
    alignItems: "flex-start",
  },
  name: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "700",
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
  remove: {
    width: 44,
    height: 44,
    marginRight: Theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.5,
  },
});
