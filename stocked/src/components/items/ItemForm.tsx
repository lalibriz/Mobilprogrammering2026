import { Theme } from "@/constants/theme";
import { addDays } from "@/utils/expiry";
import { ItemSchema, type Item } from "@/utils/item-schema";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type ItemFormProps = {
  onAdd: (item: Omit<Item, "id">) => void;
};

const NewItemSchema = ItemSchema.omit({ id: true });

export function ItemForm({ onAdd }: ItemFormProps) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [expiresAt, setExpiresAt] = useState(addDays(7));
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const result = NewItemSchema.safeParse({
      name: name.trim(),
      quantity: Number(quantity),
      expiresAt,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onAdd(result.data);
    setName("");
    setQuantity("1");
    setExpiresAt(addDays(7));
    setError(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legg til vare</Text>
      <TextInput
        style={styles.input}
        placeholder="Navn, f.eks. Melk"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.small]}
          placeholder="Antall"
          keyboardType="number-pad"
          value={quantity}
          onChangeText={setQuantity}
        />
        <TextInput
          style={[styles.input, styles.grow]}
          placeholder="ÅÅÅÅ-MM-DD"
          value={expiresAt}
          onChangeText={setExpiresAt}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={submit}
      >
        <Text style={styles.buttonText}>Legg i kjøleskapet</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.sm,
    padding: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.surface,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  title: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "700",
    color: Theme.text,
  },
  row: {
    flexDirection: "row",
    gap: Theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.radius.sm,
    padding: Theme.spacing.md,
    backgroundColor: Theme.background,
    color: Theme.text,
  },
  small: {
    width: 90,
  },
  grow: {
    flex: 1,
  },
  error: {
    color: Theme.danger,
    fontSize: Theme.fontSize.sm,
  },
  button: {
    backgroundColor: Theme.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: Theme.textInverted,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.7,
  },
});
