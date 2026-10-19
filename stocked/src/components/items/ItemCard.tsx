import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import {
  daysUntilExpiry,
  expiryStatus,
  type ExpiryStatus,
} from "@/utils/expiry";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

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

// Short enough to fit one line on a three-per-shelf tile
function shortLabel(expiresAt: Item["expiresAt"]) {
  const d = daysUntilExpiry(expiresAt);
  if (d < 0) return "Utgått";
  if (d === 0) return "I dag";
  if (d === 1) return "I morgen";
  return `${d} dager`;
}

const JARS = ["#ffb020", "#ff6b6b", "#2ecc8f", "#2fa8f0", "#8f7bff", "#ff8a4c"];

/** A product standing on a glass shelf. Tap to edit, × to remove. */
export function ItemCard({ item, onEdit, onRemove }: ItemCardProps) {
  const { id, name, quantity, expiresAt, imageUrl } = item;
  const colors = BADGE[expiryStatus(expiresAt)];
  const jar = JARS[name.charCodeAt(0) % JARS.length];

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.slot}>
      <Pressable
        accessibilityLabel={`Rediger ${name}`}
        onPress={() => onEdit(id)}
        style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.jar, { backgroundColor: jar }]}>
            <Text style={styles.jarLetter}>{name.charAt(0).toUpperCase()}</Text>
            <View style={styles.jarShine} />
          </View>
        )}
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.quantity}>× {quantity}</Text>
        <View style={[styles.badge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.badgeText, { color: colors.fg }]} numberOfLines={1}>
            {shortLabel(expiresAt)}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityLabel={`Fjern ${name}`}
        onPress={() => onRemove(id)}
        hitSlop={12}
        style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
      >
        <Icon name="remove" size={12} color={Theme.textInverted} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  tile: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 4,
  },
  image: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  jar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxShadow: [
      { offsetX: 0, offsetY: 4, blurRadius: 6, color: "rgba(40,70,90,0.35)" },
      { offsetX: 0, offsetY: -4, blurRadius: 6, color: "rgba(0,0,0,0.18)", inset: true },
    ],
  },
  jarLetter: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "800",
    color: "rgba(255,255,255,0.95)",
  },
  jarShine: {
    position: "absolute",
    left: 8,
    top: 6,
    bottom: 6,
    width: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  name: {
    marginTop: 4,
    fontSize: Theme.fontSize.md,
    fontWeight: "700",
    color: Theme.text,
  },
  quantity: {
    fontSize: Theme.fontSize.sm,
    color: Theme.muted,
  },
  badge: {
    marginTop: 2,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.radius.lg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  remove: {
    position: "absolute",
    top: -4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(60,80,95,0.55)",
  },
  pressed: {
    opacity: 0.5,
  },
});
