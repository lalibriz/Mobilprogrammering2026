import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

import { ItemLayout } from "@/components/items/ItemLayout";
import { Loading } from "@/components/shared/Loading";
import { makeStyles, useTheme } from "@/contexts/ThemeContext";
import { toEnglish, toNorwegian } from "@/data/ingredients-no";
import { useItems } from "@/contexts/ItemsContext";
import { useShopping } from "@/contexts/ShoppingContext";
import { useRecipe } from "@/queries/recipes";
import { matchRecipe } from "@/utils/recipe-match";

export default function RecipeDetail() {
  const styles = useStyles();
  const Theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items } = useItems();
  const { addItems } = useShopping();
  const { data: recipe, isError, refetch } = useRecipe(id);
  const [added, setAdded] = useState(false);

  const fridgeEn = items
    .map((item) => toEnglish(item.name))
    .filter((name): name is string => name !== undefined);
  const match = recipe ? matchRecipe(recipe.ingredients, fridgeEn) : null;

  return (
    <ItemLayout>
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.back}>‹ Tilbake</Text>
      </Pressable>

      {isError ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Kunne ikke hente oppskriften</Text>
          <Pressable style={styles.button} onPress={() => refetch()}>
            <Text style={styles.buttonText}>Prøv igjen</Text>
          </Pressable>
        </View>
      ) : !recipe || !match ? (
        <Loading label="Henter oppskrift..." />
      ) : (
        <>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <Text style={styles.title}>{recipe.title}</Text>

          <Text style={styles.sectionTitle}>Ingredienser</Text>
          <View style={styles.list}>
            {recipe.ingredients.map((ingredient) => {
              const have = match.have.includes(ingredient);
              return (
                <Text
                  key={ingredient}
                  style={[styles.ingredient, { color: have ? Theme.success : Theme.danger }]}
                >
                  {have ? "✓" : "✗"} {ingredient}
                </Text>
              );
            })}
          </View>

          {match.missing.length > 0 && (
            <View style={styles.missing}>
              <Text style={styles.sectionTitle}>Mangler ({match.missing.length})</Text>
              <Text style={styles.muted}>{match.missing.join(", ")}</Text>
              <Pressable
                style={[styles.button, added && styles.buttonDone]}
                disabled={added}
                onPress={() => {
                  addItems(match.missing.map(toNorwegian));
                  setAdded(true);
                }}
              >
                <Text style={styles.buttonText}>
                  {added ? "Lagt til" : "Legg alle til i handleliste"}
                </Text>
              </Pressable>
            </View>
          )}

          <Text style={styles.sectionTitle}>Fremgangsmåte</Text>
          <Text style={styles.instructions}>{recipe.instructions}</Text>
        </>
      )}
    </ItemLayout>
  );
}

const useStyles = makeStyles((Theme) => ({
  back: { color: Theme.primary, fontSize: Theme.fontSize.lg, fontWeight: "600" },
  image: {
    width: "100%",
    aspectRatio: 16 / 10,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.pill,
  },
  title: { fontSize: Theme.fontSize.title, fontWeight: "700", color: Theme.text },
  sectionTitle: { fontSize: Theme.fontSize.xl, fontWeight: "700", color: Theme.text },
  list: { gap: Theme.spacing.xs },
  ingredient: { fontSize: Theme.fontSize.md },
  missing: {
    gap: Theme.spacing.md,
    padding: Theme.spacing.lg,
    backgroundColor: Theme.surface,
    borderRadius: Theme.radius.lg,
  },
  muted: { color: Theme.muted, fontSize: Theme.fontSize.md },
  instructions: { color: Theme.text, fontSize: Theme.fontSize.md, lineHeight: 22 },
  center: { alignItems: "center", gap: Theme.spacing.md },
  button: {
    backgroundColor: Theme.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
  },
  buttonDone: { backgroundColor: Theme.muted },
  buttonText: { color: Theme.textInverted, fontWeight: "600" },
}));
