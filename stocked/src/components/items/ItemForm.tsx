import { DateField } from "@/components/items/DateField";
import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { addDays } from "@/utils/expiry";
import { ItemSchema, type Item } from "@/utils/item-schema";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type ItemFormProps = {
  onSubmit: (item: Omit<Item, "id">) => void;
  /** Når satt, redigerer skjemaet denne varen i stedet for å legge til en ny. */
  editing?: Item;
  onCancel?: () => void;
  /** Valgfri måte å legge til en vare på; vises bare når en ny vare legges til. */
  onScan?: () => void;
  /** Forhåndsutfylt navn for en ny vare, f.eks. fra en skannet strekkode. */
  initialName?: string;
  initialImageUrl?: string;
};

const NewItemSchema = ItemSchema.omit({ id: true });

function Field({
  label,
  style,
  children,
}: {
  label: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function StepButton({
  label,
  symbol,
  onPress,
}: {
  label: string;
  symbol: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.step, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.stepText}>{symbol}</Text>
    </Pressable>
  );
}

export function ItemForm({
  onSubmit,
  editing,
  onCancel,
  onScan,
  initialName,
  initialImageUrl,
}: ItemFormProps) {
  const [name, setName] = useState(editing?.name ?? initialName ?? "");
  const [quantity, setQuantity] = useState(
    editing ? String(editing.quantity) : "1",
  );
  const [expiresAt, setExpiresAt] = useState(editing?.expiresAt ?? addDays(7));
  const [error, setError] = useState<string | null>(null);

  function changeQuantity(delta: number) {
    const current = Number.parseInt(quantity, 10) || 0;

    setQuantity(String(Math.max(1, current + delta)));
  }

  function submit() {
    const result = NewItemSchema.safeParse({
      name: name.trim(),
      quantity: Number(quantity),
      expiresAt,
      imageUrl: editing?.imageUrl ?? initialImageUrl,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onSubmit(result.data);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editing ? "Rediger vare" : "Legg til vare"}
      </Text>
      {onScan && !editing ? (
        <Pressable
          style={({ pressed }) => [styles.scan, pressed && styles.pressed]}
          onPress={onScan}
        >
          <Icon name="barcode" size={20} color={Theme.primary} />
          <Text style={styles.scanText}>Skann strekkode</Text>
        </Pressable>
      ) : null}
      <Field label="Navn">
        <TextInput
          style={styles.input}
          placeholder="F.eks. Melk"
          value={name}
          onChangeText={setName}
        />
      </Field>
      <View style={styles.row}>
        <Field label="Antall" style={styles.quantity}>
          <View style={styles.stepper}>
            <StepButton
              label="Færre"
              symbol="−"
              onPress={() => changeQuantity(-1)}
            />
            <TextInput
              style={[styles.input, styles.stepperInput]}
              keyboardType="number-pad"
              textAlign="center"
              value={quantity}
              onChangeText={setQuantity}
            />
            <StepButton
              label="Flere"
              symbol="+"
              onPress={() => changeQuantity(1)}
            />
          </View>
        </Field>
        <Field label="Utløpsdato" style={styles.grow}>
          <DateField value={expiresAt} onChange={setExpiresAt} />
        </Field>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={submit}
      >
        <Text style={styles.buttonText}>
          {editing ? "Lagre endringer" : "Legg i kjøleskapet"}
        </Text>
      </Pressable>
      {onCancel ? (
        <Pressable
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Avbryt</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "700",
    color: Theme.text,
  },
  row: {
    flexDirection: "row",
    gap: Theme.spacing.md,
  },
  input: {
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.pill,
    boxShadow: Theme.shadow.well,
    color: Theme.text,
  },
  field: {
    gap: Theme.spacing.xs,
  },
  label: {
    marginLeft: Theme.spacing.md,
    fontSize: Theme.fontSize.sm,
    fontWeight: "600",
    color: Theme.muted,
  },
  quantity: {
    width: 168,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
  },
  stepperInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 0,
  },
  step: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: Theme.raised,
    boxShadow: Theme.shadow.raised,
  },
  stepText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "700",
    lineHeight: 20,
    color: Theme.primary,
  },
  grow: {
    flex: 1,
  },
  error: {
    marginLeft: Theme.spacing.md,
    color: Theme.danger,
    fontSize: Theme.fontSize.sm,
  },
  button: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: Theme.contrast,
    boxShadow: Theme.shadow.button,
  },
  buttonText: {
    color: Theme.textInverted,
    fontSize: Theme.fontSize.lg,
    fontWeight: "700",
  },
  scan: {
    minHeight: 48,
    flexDirection: "row",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: Theme.raised,
    boxShadow: Theme.shadow.raised,
  },
  scanText: {
    color: Theme.primary,
    fontWeight: "700",
  },
  cancel: {
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: Theme.muted,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
