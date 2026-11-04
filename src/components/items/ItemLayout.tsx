import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import { ScrollView, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Felles innholdsstil for alle skjermer: safe area (også i landscape) og maks bredde. */
export function useContentStyle(): ViewStyle {
  const styles = useStyles();
  const Theme = useTheme();
  const insets = useSafeAreaInsets();

  return {
    ...styles.content,
    paddingTop: insets.top + Theme.spacing.lg,
    paddingLeft: insets.left + Theme.spacing.lg,
    paddingRight: insets.right + Theme.spacing.lg,
  };
}

export function ItemLayout({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  const content = useContentStyle();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={content}
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
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
  },
}));
