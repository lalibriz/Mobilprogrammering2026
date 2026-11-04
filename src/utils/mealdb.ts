const BASE = "https://www.themealdb.com/api/json/v1/1/";

export type RecipeSummary = { id: string; title: string; image: string };
export type Recipe = RecipeSummary & {
  instructions: string;
  ingredients: string[];
};

type RawMeal = Record<string, string | null>;

async function getMeals(path: string): Promise<RawMeal[]> {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`TheMealDB ${res.status}`);
  const json = await res.json();
  return json.meals ?? [];
}

export function parseMeal(raw: RawMeal): Recipe {
  const ingredients: string[] = [];
  const seen = new Set<string>();
  for (let i = 1; i <= 20; i++) {
    const name = raw[`strIngredient${i}`]?.trim();
    // Noen oppskrifter lister samme ingrediens flere ganger
    if (name && !seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase());
      ingredients.push(name);
    }
  }
  return {
    id: raw.idMeal ?? "",
    title: raw.strMeal ?? "",
    image: raw.strMealThumb ?? "",
    instructions: raw.strInstructions ?? "",
    ingredients,
  };
}

const toSummary = (m: RawMeal): RecipeSummary => ({
  id: m.idMeal ?? "",
  title: m.strMeal ?? "",
  image: m.strMealThumb ?? "",
});

// Gratisnøkkelen støtter bare én ingrediens per kall (shortcut: ett kall per vare).
export async function fetchCandidates(
  fridgeEn: string[],
): Promise<RecipeSummary[]> {
  const results = await Promise.all(
    fridgeEn.map((name) =>
      getMeals(`filter.php?i=${encodeURIComponent(name.replace(/ /g, "_"))}`).catch(
        () => [],
      ),
    ),
  );

  const hits = new Map<string, { recipe: RecipeSummary; count: number }>();
  for (const meals of results) {
    for (const meal of meals) {
      const entry = hits.get(meal.idMeal ?? "");
      if (entry) entry.count++;
      else hits.set(meal.idMeal ?? "", { recipe: toSummary(meal), count: 1 });
    }
  }

  return [...hits.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
    .map((h) => h.recipe);
}

export async function fetchRecipe(id: string): Promise<Recipe | null> {
  try {
    const [meal] = await getMeals(`lookup.php?i=${encodeURIComponent(id)}`);
    return meal ? parseMeal(meal) : null;
  } catch {
    return null;
  }
}

// Verifisert: search.php?s= med tomt søk gir en liste med retter.
export async function fetchFallback(): Promise<RecipeSummary[]> {
  try {
    return (await getMeals("search.php?s=")).map(toSummary).slice(0, 12);
  } catch {
    return [];
  }
}

export async function fetchCategories(): Promise<string[]> {
  const meals = await getMeals("list.php?c=list");
  return meals.map((m) => m.strCategory ?? "").filter(Boolean);
}

export async function fetchByCategory(
  category: string,
): Promise<RecipeSummary[]> {
  return (await getMeals(`filter.php?c=${encodeURIComponent(category)}`)).map(
    toSummary,
  );
}

export async function fetchSearch(query: string): Promise<RecipeSummary[]> {
  return (await getMeals(`search.php?s=${encodeURIComponent(query)}`)).map(
    toSummary,
  );
}
