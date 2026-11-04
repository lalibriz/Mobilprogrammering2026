import { DateField } from "@/components/items/DateField";
import { Icon } from "@/components/shared/Icon";
import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import { addDays } from "@/utils/expiry";
import { ItemSchema, type Item } from "@/utils/item-schema";
import { useState } from "react";
import {
  Pressable,
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

type FieldErrors = Partial<Record<"name" | "quantity" | "expiresAt", string>>;

function Field({
  label,
  style,
  error,
  children,
}: {
  label: string;
  style?: StyleProp<ViewStyle>;
  error?: string;
  children: React.ReactNode;
}) {
  const styles = useStyles();
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  const styles = useStyles();
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
  const styles = useStyles();
  const Theme = useTheme();
  const [name, setName] = useState(editing?.name ?? initialName ?? "");
  const [quantity, setQuantity] = useState(
    editing ? String(editing.quantity) : "1",
  );
  const [expiresAt, setExpiresAt] = useState(editing?.expiresAt ?? addDays(7));
  const [errors, setErrors] = useState<FieldErrors>({});

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
      const fields = result.error.flatten().fieldErrors;
      setErrors({
        name: fields.name?.[0],
        quantity: fields.quantity?.[0],
        expiresAt: fields.expiresAt?.[0],
      });
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
      <Field label="Navn" error={errors.name}>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          placeholder="F.eks. Melk"
          accessibilityLabel="Navn"
          value={name}
          onChangeText={setName}
        />
      </Field>
      <View style={styles.row}>
        <Field label="Antall" style={styles.quantity} error={errors.quantity}>
          <View style={styles.stepper}>
            <StepButton
              label="Færre"
              symbol="−"
              onPress={() => changeQuantity(-1)}
            />
            <TextInput
              style={[styles.input, styles.stepperInput, errors.quantity && styles.inputError]}
              accessibilityLabel="Antall"
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
        <Field label="Utløpsdato" style={styles.grow} error={errors.expiresAt}>
          <DateField value={expiresAt} onChange={setExpiresAt} />
        </Field>
      </View>
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

const useStyles = makeStyles((Theme) => ({
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
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: { borderColor: Theme.danger },
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
}));
