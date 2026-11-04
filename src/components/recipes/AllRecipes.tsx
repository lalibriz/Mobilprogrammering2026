import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { useContentStyle } from "@/components/items/ItemLayout";
import { Loading } from "@/components/shared/Loading";
import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import {
  useCategories,
  useCategoryRecipes,
  useRecipeSearch,
} from "@/queries/recipes";
import { RecipeCard } from "./RecipeCard";

// Bla gjennom alle oppskrifter i databasen, én kategori om gangen.
export function AllRecipes({ header }: { header: React.ReactElement }) {
  const styles = useStyles();
  const Theme = useTheme();
  const content = useContentStyle();
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 2 : 1;
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  // Søker på navn etter en kort pause i skrivingen
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const categories = useCategories();
  const category =
    picked ??
    (categories.data?.includes("Chicken") ? "Chicken" : categories.data?.[0]) ??
    null;
  const searching = query.trim().length > 0;
  const search = useRecipeSearch(debounced);
  const byCategory = useCategoryRecipes(searching ? null : category);

  const active = searching ? search : byCategory;
  const failed = searching ? search.isError : categories.isError || byCategory.isError;
  const list = active.data;
  // Mens brukeren skriver, men søket ikke har startet ennå, vises lasting
  const pending = searching ? debounced !== query.trim() || search.isPending : !list;

  function retry() {
    if (searching) search.refetch();
    else if (categories.isError) categories.refetch();
    else byCategory.refetch();
  }

  return (
    <FlatList
      key={columns}
      style={styles.list}
      contentContainerStyle={[content, styles.listContent]}
      data={failed || pending ? [] : (list ?? [])}
      keyExtractor={(recipe) => recipe.id}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? styles.column : undefined}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.container}>
          {header}
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="Søk etter oppskrift"
            placeholderTextColor={Theme.muted}
            accessibilityLabel="Søk etter oppskrift"
            autoCorrect={false}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />

          {!searching && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chips}>
                {(categories.data ?? []).map((name) => (
                  <Pressable
                    key={name}
                    onPress={() => setPicked(name)}
                    style={[styles.chip, name === category && styles.chipActive]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        name === category && styles.chipTextActive,
                      ]}
                    >
                      {name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}

          {!failed && !pending && list ? (
            <Text style={styles.muted}>
              {list.length === 0 ? "Ingen treff" : `${list.length} oppskrifter`}
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        failed ? (
          <View style={styles.center}>
            <Text style={styles.muted}>Kunne ikke hente oppskrifter</Text>
            <Pressable style={styles.retry} onPress={retry}>
              <Text style={styles.retryText}>Prøv igjen</Text>
            </Pressable>
          </View>
        ) : pending ? (
          <Loading label="Henter oppskrifter..." />
        ) : null
      }
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <RecipeCard recipe={item} />
        </View>
      )}
    />
  );
}

const useStyles = makeStyles((Theme) => ({
  list: { flex: 1, backgroundColor: Theme.background },
  listContent: { gap: Theme.spacing.md },
  column: { gap: Theme.spacing.md },
  cell: { flex: 1 },
  container: { gap: Theme.spacing.lg },
  input: {
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Theme.text,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.surface,
  },
  chips: { flexDirection: "row", gap: Theme.spacing.sm },
  chip: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.xl,
    backgroundColor: Theme.pill,
  },
  chipActive: { backgroundColor: Theme.primary },
  chipText: { color: Theme.text, fontWeight: "600" },
  chipTextActive: { color: Theme.textInverted },
  muted: { color: Theme.muted, fontSize: Theme.fontSize.md },
  center: { alignItems: "center", gap: Theme.spacing.md },
  retry: {
    backgroundColor: Theme.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.md,
  },
  retryText: { color: Theme.textInverted, fontWeight: "600" },
}));
