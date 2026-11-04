import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import type { RecipeSummary } from "@/utils/mealdb";
import type { ScoredRecipe } from "@/utils/suggest-recipes";

// Uten match-data (bla i alle oppskrifter) vises kortet uten ingrediensmerke.
export function RecipeCard({
  recipe,
}: {
  recipe: RecipeSummary & Partial<ScoredRecipe>;
}) {
  const styles = useStyles();
  const Theme = useTheme();
  const scored = recipe.have && recipe.missing && recipe.ingredients;
  const complete = recipe.missing?.length === 0;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
    >
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        {scored && (
          <View
            style={[
              styles.badge,
              { backgroundColor: complete ? Theme.successLight : Theme.warningLight },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: complete ? Theme.success : Theme.warningDark },
              ]}
            >
              {recipe.have!.length}/{recipe.ingredients!.length} ingredienser
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((Theme) => ({
  card: {
    flexDirection: "row",
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    boxShadow: Theme.shadow.card,
  },
  image: {
    width: 96,
    height: 96,
    backgroundColor: Theme.pill,
  },
  body: {
    flex: 1,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    justifyContent: "center",
  },
  title: {
    fontSize: Theme.fontSize.lg,
    fontWeight: "600",
    color: Theme.text,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.sm,
  },
  badgeText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: "600",
  },
}));
