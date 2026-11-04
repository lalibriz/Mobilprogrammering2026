import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ItemLayout({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  const Theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Theme.spacing.lg },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const useStyles = makeStyles((Theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    gap: Theme.spacing.lg,
    padding: Theme.spacing.lg,
  },
}));
