import { toEnglish } from "../data/ingredients-no";
import {
  fetchCandidates,
  fetchFallback,
  fetchRecipe,
  type Recipe,
  type RecipeSummary,
} from "./mealdb";
import { matchRecipe, type MatchResult } from "./recipe-match";

export type ScoredRecipe = Recipe & MatchResult;

const MIN_RECIPES = 6;

// Array.sort er stabil, så like andeler beholder rekkefølgen fra API-et.
export function rankRecipes(
  recipes: Recipe[],
  fridgeEn: string[],
): ScoredRecipe[] {
  return recipes
    .map((recipe) => ({ ...recipe, ...matchRecipe(recipe.ingredients, fridgeEn) }))
    .sort((a, b) => b.ratio - a.ratio);
}

async function lookupAll(summaries: RecipeSummary[]): Promise<Recipe[]> {
  const recipes = await Promise.all(summaries.map((s) => fetchRecipe(s.id)));
  return recipes.filter((r): r is Recipe => r !== null);
}

export async function loadSuggestions(
  fridgeNames: string[],
): Promise<ScoredRecipe[]> {
  const fridgeEn = fridgeNames
    .map(toEnglish)
    .filter((name): name is string => name !== undefined);

  let recipes = await lookupAll(await fetchCandidates(fridgeEn));

  if (recipes.length < MIN_RECIPES) {
    const known = new Set(recipes.map((r) => r.id));
    const extra = (await fetchFallback()).filter((s) => !known.has(s.id));
    recipes = [...recipes, ...(await lookupAll(extra))];
  }

  if (!recipes.length) throw new Error("Ingen oppskrifter kunne hentes");
  return rankRecipes(recipes, fridgeEn);
}
