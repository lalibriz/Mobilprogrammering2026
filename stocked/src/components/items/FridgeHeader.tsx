import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import type { Item } from "@/utils/item-schema";
import { expiryStatus } from "@/utils/expiry";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type FridgeHeaderProps = {
  name: string;
  onRename: (name: string) => void;
  items: Item[];
};

/** Digital display on the fridge door: name plus three LED counters. */
export function FridgeHeader({ name, onRename, items }: FridgeHeaderProps) {
  const soon = items.filter((i) => expiryStatus(i.expiresAt) === "soon").length;
  const expired = items.filter(
    (i) => expiryStatus(i.expiresAt) === "expired",
  ).length;
  const fresh = items.length - soon - expired;

  const [editingName, setEditingName] = useState(false);
  const [draft, setDraft] = useState(name);

  function startEditing() {
    setDraft(name);
    setEditingName(true);
  }

  function saveName() {
    onRename(draft);
    setEditingName(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {editingName ? (
          <TextInput
            style={[styles.title, styles.titleInput]}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={saveName}
            onBlur={saveName}
            autoFocus
            selectTextOnFocus
            returnKeyType="done"
            maxLength={30}
            accessibilityLabel="Navn på kjøleskapet"
          />
        ) : (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
            <Pressable
              accessibilityLabel="Endre navn på kjøleskapet"
              onPress={startEditing}
              hitSlop={12}
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Icon name="edit" size={16} color={LABEL} />
            </Pressable>
          </>
        )}
      </View>
      <View style={styles.stats}>
        <Stat value={fresh} label="Varer" />
        <Stat value={soon} label="Snart ute" />
        <Stat value={expired} label="Utgått" />
      </View>
      <View style={styles.divider} />
      {/* Glass reflection across the panel */}
      <View pointerEvents="none" style={styles.sheen} />
    </View>
  );
}

// Blue LED digits on black glass, like a built-in fridge control panel
const LED = "#3da5ff";
const LABEL = "rgba(255,255,255,0.75)";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    overflow: "hidden",
    backgroundColor: "#0a0c0f",
    experimental_backgroundImage: "linear-gradient(160deg, #1a1e23, #07090b 60%)",
    borderRadius: Theme.radius.lg,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
    // Light steel bezel around the glass
    borderWidth: 3,
    borderColor: "#d3d9de",
    boxShadow: [
      { offsetX: 0, offsetY: 2, blurRadius: 6, color: "rgba(0,0,0,0.7)", inset: true },
      { offsetX: 0, offsetY: 2, blurRadius: 6, color: "rgba(40,50,60,0.35)" },
    ],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
  },
  titleInput: {
    flex: 1,
    padding: 0,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: LABEL,
  },
  pressed: {
    opacity: 0.5,
  },
  title: {
    fontSize: Theme.fontSize.md,
    color: LABEL,
    letterSpacing: 0.5,
  },
  stats: {
    flexDirection: "row",
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: LABEL,
  },
  statValue: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
    color: LED,
    textShadowColor: "#1e7bff",
    textShadowRadius: 10,
  },
  divider: {
    height: 1,
    marginHorizontal: Theme.spacing.xl,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  sheen: {
    position: "absolute",
    top: -20,
    bottom: -20,
    left: "10%",
    width: 70,
    backgroundColor: "rgba(255,255,255,0.05)",
    transform: [{ rotate: "15deg" }],
  },
});
