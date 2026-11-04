import type { Recipe } from "./mealdb";
import { rankRecipes } from "./suggest-recipes";

const recipe = (id: string, ingredients: string[]): Recipe => ({
  id,
  title: id,
  image: "",
  instructions: "",
  ingredients,
});

describe("rankRecipes", () => {
  it("sorterer etter andel ingredienser du har", () => {
    const ranked = rankRecipes(
      [recipe("a", ["x", "y"]), recipe("b", ["milk"]), recipe("c", ["milk", "y"])],
      ["milk"],
    );
    expect(ranked.map((r) => r.id)).toEqual(["b", "c", "a"]);
  });

  it("beholder rekkefølgen ved lik andel", () => {
    const ranked = rankRecipes([recipe("a", ["x"]), recipe("b", ["y"])], []);
    expect(ranked.map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("tom liste gir tom liste", () => {
    expect(rankRecipes([], ["milk"])).toEqual([]);
  });
});
