import { fetchByCategory, fetchCategories, fetchRecipe, fetchSearch } from "@/utils/mealdb";
import { loadSuggestions } from "@/utils/suggest-recipes";
import { useQuery } from "@tanstack/react-query";

/** Forslag basert på innholdet i kjøleskapet; hentes på nytt når varenavnene endres. */
export const useSuggestions = (fridgeNames: string[]) =>
  useQuery({
    queryKey: ["suggestions", fridgeNames],
    queryFn: () => loadSuggestions(fridgeNames),
  });

export const useCategories = () =>
  useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

export const useCategoryRecipes = (category: string | null) =>
  useQuery({
    queryKey: ["category", category],
    queryFn: () => fetchByCategory(category!),
    enabled: !!category,
  });

export const useRecipeSearch = (query: string) =>
  useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearch(query),
    enabled: query.length > 0,
  });

export const useRecipe = (id: string) =>
  useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const recipe = await fetchRecipe(id);
      if (!recipe) throw new Error("Oppskriften finnes ikke");
      return recipe;
    },
  });
