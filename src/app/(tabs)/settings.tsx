import { Icon } from "@/components/shared/Icon";
import { ItemLayout } from "@/components/items/ItemLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useItems } from "@/contexts/ItemsContext";
import { useShopping } from "@/contexts/ShoppingContext";
import {
  makeStyles,
  useThemeSettings,
  type ThemeMode,
} from "@/contexts/ThemeContext";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

const MODES: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Lys" },
  { value: "dark", label: "Mørk" },
];

function confirm(
  title: string,
  message: string,
  action: string,
  run: () => void,
) {
  Alert.alert(title, message, [
    { text: "Avbryt", style: "cancel" },
    { text: action, style: "destructive", onPress: run },
  ]);
}

export default function Settings() {
  const styles = useStyles();
  const { theme, mode, setMode } = useThemeSettings();
  const { fridgeName, rename, items, remove } = useItems();
  const shopping = useShopping();
  const { user, signOut } = useAuth();
  const [name, setName] = useState(fridgeName);
  const [cacheCleared, setCacheCleared] = useState(false);

  async function clearCache() {
    await Image.clearDiskCache();
    await Image.clearMemoryCache();
    setCacheCleared(true);
  }

  function deleteAll() {
    items.forEach((item) => remove(item.id));
    shopping.clearItems();
  }

  return (
    <ItemLayout>
      <Text style={styles.title}>Innstillinger</Text>

      <Text style={styles.section}>Utseende</Text>
      <View style={styles.segments}>
        {MODES.map(({ value, label }) => (
          <Pressable
            key={value}
            style={[styles.segment, mode === value && styles.segmentActive]}
            onPress={() => setMode(value)}
            accessibilityRole="button"
            accessibilityState={{ selected: mode === value }}
          >
            <Text
              style={[
                styles.segmentText,
                mode === value && styles.segmentTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Kjøleskap</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        onBlur={() => (name.trim() ? rename(name) : setName(fridgeName))}
        placeholder="Navn på kjøleskapet"
        placeholderTextColor={theme.muted}
        accessibilityLabel="Navn på kjøleskapet"
      />

      <Text style={styles.section}>Data</Text>
      <Pressable style={styles.row} onPress={clearCache}>
        <Icon name="remove" size={18} color={theme.primary} />
        <Text style={styles.rowText}>
          {cacheCleared ? "Hurtigminnet er tømt" : "Tøm hurtigminne (bilder)"}
        </Text>
      </Pressable>
      <Pressable
        style={[styles.row, styles.rowDanger]}
        onPress={() =>
          confirm(
            "Slett alle data?",
            "Alle varer og hele handlelisten slettes. Dette kan ikke angres.",
            "Slett",
            deleteAll,
          )
        }
      >
        <Icon name="remove" size={18} color={theme.danger} />
        <Text style={[styles.rowText, { color: theme.danger }]}>
          Slett alle data
        </Text>
      </Pressable>

      <Text style={styles.section}>Konto</Text>
      <Pressable style={styles.row} onPress={signOut} accessibilityRole="button">
        <Icon name="remove" size={18} color={theme.primary} />
        <Text style={styles.rowText}>Logg ut ({user})</Text>
      </Pressable>

      <Text style={styles.section}>Om</Text>
      <Text style={styles.about}>
        Stocked {Constants.expoConfig?.version ?? ""}
      </Text>
    </ItemLayout>
  );
}

const useStyles = makeStyles((Theme) => ({
  title: {
    fontSize: Theme.fontSize.title,
    fontWeight: "700",
    color: Theme.text,
  },
  section: {
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.sm,
    fontSize: Theme.fontSize.sm,
    fontWeight: "700",
    textTransform: "uppercase",
    color: Theme.muted,
  },
  segments: {
    flexDirection: "row",
    padding: Theme.spacing.xs,
    gap: Theme.spacing.xs,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.pill,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.sm,
  },
  segmentActive: { backgroundColor: Theme.raised },
  segmentText: { fontSize: Theme.fontSize.md, color: Theme.muted },
  segmentTextActive: { color: Theme.primary, fontWeight: "700" },
  input: {
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Theme.text,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.surface,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.surface,
  },
  rowDanger: { backgroundColor: Theme.dangerLight },
  rowText: { fontSize: Theme.fontSize.md, color: Theme.text },
  about: { fontSize: Theme.fontSize.md, color: Theme.muted },
}));
