import { useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";

import { useContentStyle } from "@/components/items/ItemLayout";
import { AllRecipes } from "@/components/recipes/AllRecipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Loading } from "@/components/shared/Loading";
import { useItems } from "@/contexts/ItemsContext";
import { makeStyles } from "@/contexts/ThemeContext";
import { useSuggestions } from "@/queries/recipes";

export default function Recipes() {
  const styles = useStyles();
  const content = useContentStyle();
  const { items } = useItems();
  const suggestions = useSuggestions(items.map((item) => item.name));
  const [tab, setTab] = useState<"foryou" | "all">("foryou");

  const recipes = suggestions.data ?? [];
  const sections = [
    { title: "Du kan lage nå", data: recipes.filter((r) => r.missing.length === 0) },
    { title: "Nesten klar", data: recipes.filter((r) => r.missing.length >= 1 && r.missing.length <= 2) },
    { title: "Flere forslag", data: recipes.filter((r) => r.missing.length > 2) },
  ].filter((section) => section.data.length > 0);

  const header = (
    <View style={styles.headerWrap}>
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
    </View>
  );

  if (tab === "all") return <AllRecipes header={header} />;

  return (
    <SectionList
      style={styles.list}
      contentContainerStyle={[content, styles.listContent]}
      sections={sections}
      keyExtractor={(recipe) => recipe.id}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={header}
      ListEmptyComponent={
        suggestions.isError ? (
          <View style={styles.center}>
            <Text style={styles.subtitle}>Kunne ikke hente oppskrifter</Text>
            <Pressable style={styles.retry} onPress={() => suggestions.refetch()}>
              <Text style={styles.retryText}>Prøv igjen</Text>
            </Pressable>
          </View>
        ) : (
          <Loading label="Finner oppskrifter..." />
        )
      }
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      renderItem={({ item }) => <RecipeCard recipe={item} />}
    />
  );
}

const useStyles = makeStyles((Theme) => ({
  list: { flex: 1, backgroundColor: Theme.background },
  listContent: { gap: Theme.spacing.md },
  headerWrap: { gap: Theme.spacing.lg },
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
  sectionTitle: {
    marginTop: Theme.spacing.md,
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
