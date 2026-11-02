export type MatchResult = { have: string[]; missing: string[]; ratio: number };

export function matchRecipe(
  ingredients: string[],
  fridgeEn: string[],
): MatchResult {
  const owned = new Set(fridgeEn.map((n) => n.trim().toLowerCase()));
  const have: string[] = [];
  const missing: string[] = [];

  for (const ingredient of ingredients) {
    (owned.has(ingredient.trim().toLowerCase()) ? have : missing).push(
      ingredient,
    );
  }

  const ratio = ingredients.length ? have.length / ingredients.length : 0;
  return { have, missing, ratio };
}
