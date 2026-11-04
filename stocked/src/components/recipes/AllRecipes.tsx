import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { Loading } from "@/components/shared/Loading";
import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import {
  fetchByCategory,
  fetchCategories,
  fetchSearch,
  type RecipeSummary,
} from "@/utils/mealdb";
import { RecipeCard } from "./RecipeCard";

// Bla gjennom alle oppskrifter i databasen, én kategori om gangen.
export function AllRecipes() {
  const styles = useStyles();
  const Theme = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecipeSummary[] | null>(null);
  const [searchError, setSearchError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<RecipeSummary[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback((name: string) => {
    setError(false);
    setRecipes(null);
    fetchByCategory(name)
      .then(setRecipes)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    fetchCategories()
      .then((list) => {
        setCategories(list);
        const first = list.includes("Chicken") ? "Chicken" : list[0];
        if (first) {
          setCategory(first);
          load(first);
        }
      })
      .catch(() => setError(true));
  }, [load]);

  // Søker på navn etter en kort pause i skrivingen
  const searching = query.trim().length > 0;
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    setResults(null);
    setSearchError(false);
    let stale = false;
    const timer = setTimeout(() => {
      fetchSearch(q)
        .then((r) => !stale && setResults(r))
        .catch(() => !stale && setSearchError(true));
    }, 400);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query, attempt]);

  const list = searching ? results : recipes;
  const failed = searching ? searchError : error;

  function select(name: string) {
    setCategory(name);
    load(name);
  }

  return (
    <View style={styles.container}>
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
            {categories.map((name) => (
              <Pressable
                key={name}
                onPress={() => select(name)}
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

      {failed ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Kunne ikke hente oppskrifter</Text>
          <Pressable
            style={styles.retry}
            onPress={() =>
              searching
                ? setAttempt((n) => n + 1)
                : category
                  ? load(category)
                  : setError(false)
            }
          >
            <Text style={styles.retryText}>Prøv igjen</Text>
          </Pressable>
        </View>
      ) : !list ? (
        <Loading label="Henter oppskrifter..." />
      ) : (
        <View style={styles.list}>
          <Text style={styles.muted}>
            {list.length === 0 ? "Ingen treff" : `${list.length} oppskrifter`}
          </Text>
          {list.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles((Theme) => ({
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
  list: { gap: Theme.spacing.md },
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
