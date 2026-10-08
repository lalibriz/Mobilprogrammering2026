import { Theme } from "@/constants/theme";
import { formatDate, parseDate } from "@/utils/expiry";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type DateFieldProps = {
  /** "ÅÅÅÅ-MM-DD" */
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Datovelger med innebygd kalender. iOS viser den kompakte velgeren direkte i
 * feltet. Android viser feltet som en knapp som åpner kalenderdialogen.
 */
export function DateField({ value, onChange, style }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const date = parseDate(value);

  if (Platform.OS !== "android") {
    return (
      <View style={[styles.field, styles.inline, style]}>
        <DateTimePicker
          value={date}
          mode="date"
          display="compact"
          locale="nb_NO"
          accentColor={Theme.primary}
          onValueChange={(_, picked) => onChange(formatDate(picked))}
        />
      </View>
    );
  }

  return (
    <>
      <Pressable
        style={[styles.field, style]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Velg utløpsdato"
      >
        <Text style={styles.text}>
          {date.toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={date}
          mode="date"
          accentColor={Theme.primary}
          onValueChange={(_, picked) => {
            onChange(formatDate(picked));
            setOpen(false);
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    // Samme høyde som tekstfeltene ved siden av
    minHeight: 46,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.radius.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.background,
  },
  inline: {
    alignItems: "flex-start",
  },
  text: {
    color: Theme.text,
  },
});
