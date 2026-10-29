import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type ItemHeaderProps = {
  name: string;
  onRename: (name: string) => void;
  count: number;
};

export function ItemHeader({ name, onRename, count }: ItemHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  function startEditing() {
    setDraft(name);
    setEditing(true);
  }

  function save() {
    onRename(draft);
    setEditing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        {editing ? (
          <TextInput
            style={[styles.title, styles.input]}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={save}
            onBlur={save}
            autoFocus
            selectTextOnFocus
            returnKeyType="done"
            maxLength={30}
            accessibilityLabel="Navn på kjøleskapet"
          />
        ) : (
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
        )}
        <Text style={styles.subtitle}>
          {count} {count === 1 ? "vare" : "varer"}
        </Text>
      </View>
      <Pressable
        accessibilityLabel="Endre navn på kjøleskapet"
        onPress={startEditing}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Icon name="edit" size={18} color={Theme.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: Theme.fontSize.title,
    fontWeight: "700",
    color: Theme.text,
  },
  input: {
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: Theme.primary,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.muted,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.raised,
    boxShadow: Theme.shadow.raised,
  },
  pressed: {
    opacity: 0.7,
  },
});
