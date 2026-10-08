import { ItemForm } from "@/components/items/ItemForm";
import { Theme } from "@/constants/theme";
import { useItems } from "@/contexts/ItemsContext";
import { useRouter } from "expo-router";
import { createContext, use, useEffect, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ItemEditorContextData = {
  openAdd: () => void;
  openEdit: (id: string) => void;
};

/** Hva skjemaet gjør: null = ingenting, "new" = ny vare, ellers varen som redigeres. */
type EditorState = null | "new" | { id: string };

const ItemEditorContext = createContext<ItemEditorContextData | null>(null);

// Utenfor skjermen før animasjonen starter; måles på nytt med onLayout
const INITIAL_SHEET_HEIGHT = 500;

/**
 * Eier skjemaet for å legge til og redigere varer, slik at både
 * bunnlinjen (+) og varekortene (blyantikonet) kan åpne det.
 *
 * Bakgrunnen tones inn, mens selve skjemaet glir opp nedenfra.
 */
export function ItemEditorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items, add, update } = useItems();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [state, setState] = useState<EditorState>(null);
  const [visible, setVisible] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(INITIAL_SHEET_HEIGHT);
  // 0 = lukket, 1 = åpen
  const [progress] = useState(() => new Animated.Value(0));

  const editing =
    state && state !== "new" ? items.find((i) => i.id === state.id) : undefined;

  useEffect(() => {
    if (!visible) return;

    Animated.timing(progress, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  function open(next: EditorState) {
    setState(next);
    setVisible(true);
  }

  function close() {
    Keyboard.dismiss();
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setVisible(false);
      setState(null);
    });
  }

  return (
    <ItemEditorContext
      value={{
        openAdd: () => open("new"),
        openEdit: (id) => open({ id }),
      }}
    >
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={close}
      >
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.backdrop,
              { opacity: progress },
            ]}
          >
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={close}
              accessibilityLabel="Lukk"
            />
          </Animated.View>
          <Animated.View
            onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
            style={[
              styles.sheet,
              { paddingBottom: insets.bottom + Theme.spacing.lg },
              {
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [sheetHeight, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <ItemForm
              editing={editing}
              onSubmit={(data) => {
                if (editing) update(editing.id, data);
                else add(data);
                close();
              }}
              onCancel={close}
              onScan={() => {
                close();
                router.navigate("/scanner");
              }}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </ItemEditorContext>
  );
}

export function useItemEditor() {
  const context = use(ItemEditorContext);

  if (!context) {
    throw new Error("useItemEditor must be used within an ItemEditorProvider");
  }

  return context;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.background,
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.lg,
  },
});
