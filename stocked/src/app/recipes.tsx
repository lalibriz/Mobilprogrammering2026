import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ItemLayout } from "@/components/items/ItemLayout";
import { AllRecipes } from "@/components/recipes/AllRecipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Loading } from "@/components/shared/Loading";
import { makeStyles } from "@/contexts/ThemeContext";
import { useItems } from "@/contexts/ItemsContext";
import { loadSuggestions, type ScoredRecipe } from "@/utils/suggest-recipes";

export default function Recipes() {
  const styles = useStyles();
  const { items } = useItems();
  const fridgeKey = items.map((item) => item.name).join("|");
  const loadedKey = useRef<string | null>(null);
  const [recipes, setRecipes] = useState<ScoredRecipe[] | null>(null);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"foryou" | "all">("foryou");

  const load = useCallback(() => {
    setError(false);
    setRecipes(null);
    loadSuggestions(fridgeKey ? fridgeKey.split("|") : [])
      .then((result) => {
        loadedKey.current = fridgeKey;
        setRecipes(result);
      })
      .catch(() => setError(true));
  }, [fridgeKey]);

  // Hent på nytt bare når innholdet i kjøleskapet har endret seg
  useFocusEffect(
    useCallback(() => {
      if (loadedKey.current !== fridgeKey) load();
    }, [fridgeKey, load]),
  );

  const ready = recipes?.filter((r) => r.missing.length === 0) ?? [];
  const almost =
    recipes?.filter((r) => r.missing.length >= 1 && r.missing.length <= 2) ??
    [];
  const more = recipes?.filter((r) => r.missing.length > 2) ?? [];

  return (
    <ItemLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Oppskrifter</Text>
        <Text style={styles.subtitle}>
          Forslag basert på det du har i kjøleskapet.
        </Text>
      </View>

      <View style={styles.tabs}>
        {(
          [
            ["foryou", "For deg"],
            ["all", "Alle oppskrifter"],
          ] as const
        ).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setTab(key)}
            style={[styles.tab, tab === key && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "all" ? (
        <AllRecipes />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.subtitle}>Kunne ikke hente oppskrifter</Text>
          <Pressable style={styles.retry} onPress={load}>
            <Text style={styles.retryText}>Prøv igjen</Text>
          </Pressable>
        </View>
      ) : !recipes ? (
        <Loading label="Finner oppskrifter..." />
      ) : (
        <>
          {ready.length > 0 && (
            <Section title="Du kan lage nå" recipes={ready} />
          )}
          {almost.length > 0 && (
            <Section title="Nesten klar" recipes={almost} />
          )}
          {more.length > 0 && <Section title="Flere forslag" recipes={more} />}
        </>
      )}
    </ItemLayout>
  );
}

function Section({
  title,
  recipes,
}: {
  title: string;
  recipes: ScoredRecipe[];
}) {
  const styles = useStyles();
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </View>
  );
}

const useStyles = makeStyles((Theme) => ({
  header: { gap: Theme.spacing.sm },
  title: {
    fontSize: Theme.fontSize.title,
    fontWeight: "700",
    color: Theme.text,
  },
  subtitle: { color: Theme.muted, fontSize: Theme.fontSize.md },
  tabs: {
    flexDirection: "row",
    backgroundColor: Theme.pill,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.xl,
  },
  tabActive: { backgroundColor: Theme.primary },
  tabText: { color: Theme.text, fontWeight: "600" },
  tabTextActive: { color: Theme.textInverted },
  section: { gap: Theme.spacing.md },
  sectionTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: "700",
    color: Theme.text,
  },
  center: { alignItems: "center", gap: Theme.spacing.md },
  retry: {
    backgroundColor: Theme.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.md,
  },
  retryText: { color: Theme.textInverted, fontWeight: "600" },
}));
