import { Theme } from "@/constants/theme";
import { formatDate, parseDate } from "@/utils/expiry";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CalendarSheetProps = {
  /** "ÅÅÅÅ-MM-DD" */
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
};

const WEEKDAYS = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];

/** Month calendar in the app's pill style. Tapping a day picks it and closes. */
export function CalendarSheet({ value, onChange, onClose }: CalendarSheetProps) {
  const insets = useSafeAreaInsets();
  const selected = parseDate(value);
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(selected.getFullYear(), selected.getMonth(), 1),
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = (cursor.getDay() + 6) % 7; // week starts on Monday
  const cells = [
    ...Array<null>(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const sameDay = (a: Date, y: number, m: number, d: number) =>
    a.getFullYear() === y && a.getMonth() === m && a.getDate() === d;

  function pick(date: Date) {
    onChange(formatDate(date));
  }

  return (
    <Modal transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={onClose}
          accessibilityLabel="Lukk kalender"
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + Theme.spacing.lg }]}>
          <View style={styles.header}>
            <Bubble label="Forrige måned" symbol="‹" onPress={() => setCursor(new Date(year, month - 1, 1))} />
            <Text style={styles.month}>
              {cursor.toLocaleDateString("nb-NO", { month: "long", year: "numeric" })}
            </Text>
            <Bubble label="Neste måned" symbol="›" onPress={() => setCursor(new Date(year, month + 1, 1))} />
          </View>

          <View style={styles.grid}>
            {WEEKDAYS.map((d) => (
              <Text key={d} style={[styles.cell, styles.weekday]}>
                {d}
              </Text>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <View key={`e${i}`} style={styles.cell} />;
              const isSelected = sameDay(selected, year, month, day);
              const isToday = sameDay(today, year, month, day);
              return (
                <View key={day} style={styles.cell}>
                  <Pressable
                    onPress={() => pick(new Date(year, month, day))}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    style={({ pressed }) => [
                      styles.day,
                      isToday && styles.today,
                      isSelected && styles.daySelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                      {day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={() => pick(today)}
            accessibilityRole="button"
            style={({ pressed }) => [styles.todayButton, pressed && styles.pressed]}
          >
            <Text style={styles.todayText}>I dag</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Bubble({ label, symbol, onPress }: { label: string; symbol: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.bubble, pressed && styles.pressed]}
    >
      <Text style={styles.bubbleText}>{symbol}</Text>
    </Pressable>
  );
}

const RAISED = `0px 4px 10px rgba(${Theme.shadowTint},0.28)`;
const CELL = `${100 / 7}%` as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(25,30,70,0.45)",
  },
  sheet: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    backgroundColor: Theme.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  month: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "700",
    color: Theme.text,
    textTransform: "capitalize",
  },
  bubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.raised,
    boxShadow: RAISED,
  },
  bubbleText: {
    fontSize: Theme.fontSize.xl,
    lineHeight: 28,
    color: Theme.primary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Theme.spacing.sm,
    borderRadius: 24,
    backgroundColor: Theme.pill,
    boxShadow: `inset 0px 2px 4px rgba(${Theme.shadowTint},0.18)`,
  },
  cell: {
    width: CELL,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  weekday: {
    fontSize: Theme.fontSize.sm,
    fontWeight: "600",
    color: Theme.muted,
    textAlign: "center",
    lineHeight: 44,
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  today: {
    borderWidth: 2,
    borderColor: Theme.primary,
  },
  daySelected: {
    borderWidth: 0,
    backgroundColor: Theme.contrast,
    boxShadow: "0px 6px 12px rgba(255,122,89,0.45)",
  },
  dayText: {
    color: Theme.text,
    fontWeight: "500",
  },
  dayTextSelected: {
    color: Theme.textInverted,
    fontWeight: "700",
  },
  todayButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: Theme.raised,
    boxShadow: RAISED,
  },
  todayText: {
    color: Theme.primary,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.7,
  },
});
