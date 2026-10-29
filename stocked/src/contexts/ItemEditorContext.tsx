import { ItemForm } from "@/components/items/ItemForm";
import { Theme } from "@/constants/theme";
import { useItems } from "@/contexts/ItemsContext";
import { useRouter } from "expo-router";
import { createContext, use, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ItemEditorContextData = {
  /** `prefill` fyller ut skjemaet på forhånd, f.eks. etter en strekkodeskanning. */
  openAdd: (prefill?: Prefill) => void;
  openEdit: (id: string) => void;
};

export type Prefill = { name?: string; imageUrl?: string };

/** Hva skjemaet gjør: null = lukket, "new" = ny vare, ellers varen som redigeres. */
type EditorState = null | "new" | { id: string };

const ItemEditorContext = createContext<ItemEditorContextData | null>(null);

/**
 * Eier skjemaet for å legge til og redigere varer, slik at både
 * bunnlinjen (+) og varekortene kan åpne det.
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
  const [prefill, setPrefill] = useState<Prefill>();

  const editing =
    state && state !== "new" ? items.find((i) => i.id === state.id) : undefined;

  function close() {
    setState(null);
    setPrefill(undefined);
  }

  function openAdd(next?: Prefill) {
    setPrefill(next);
    setState("new");
  }

  function openEdit(id: string) {
    setState({ id });
  }

  return (
    <ItemEditorContext value={{ openAdd, openEdit }}>
      {children}
      <Modal
        visible={state !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={close}
      >
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <Pressable
            style={[StyleSheet.absoluteFill, styles.backdrop]}
            onPress={close}
            accessibilityLabel="Lukk"
          />
          <View
            style={[
              styles.sheet,
              { paddingBottom: insets.bottom + Theme.spacing.lg },
            ]}
          >
            <ItemForm
              editing={editing}
              initialName={prefill?.name}
              initialImageUrl={prefill?.imageUrl}
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
          </View>
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
    backgroundColor: "rgba(1,42,51,0.5)",
  },
  sheet: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
