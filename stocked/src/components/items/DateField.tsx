import { Icon } from "@/components/shared/Icon";
import { Theme } from "@/constants/theme";
import { formatDate, parseDate } from "@/utils/expiry";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type DateFieldProps = {
  /** "ÅÅÅÅ-MM-DD" */
  value: string;
  onChange: (value: string) => void;
};

/**
 * Datovelger. iOS viser den kompakte velgeren direkte i feltet. Android viser
 * feltet som en knapp som åpner kalenderdialogen.
 */
export function DateField({ value, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const date = parseDate(value);

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.field, styles.inline]}>
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
        style={({ pressed }) => [
          styles.field,
          styles.button,
          pressed && styles.pressed,
        ]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Velg utløpsdato"
      >
        <Text style={styles.text}>
          {date.toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
        <Icon name="calendar" size={18} color={Theme.primary} />
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
    minHeight: 48,
    justifyContent: "center",
    borderRadius: 24,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Theme.pill,
    boxShadow: Theme.shadow.well,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inline: {
    alignItems: "flex-start",
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: Theme.text,
  },
});
