import { describe, expect, it } from "vitest";
import { parseMeal } from "./mealdb";

describe("parseMeal", () => {
  it("mapper felt og dropper tomme ingredienser", () => {
    const recipe = parseMeal({
      idMeal: "1",
      strMeal: "Pancakes",
      strMealThumb: "http://img",
      strInstructions: "Mix.",
      strIngredient1: "Milk",
      strIngredient2: "",
      strIngredient3: null,
      strIngredient4: " Egg ",
    });
    expect(recipe).toEqual({
      id: "1",
      title: "Pancakes",
      image: "http://img",
      instructions: "Mix.",
      ingredients: ["Milk", "Egg"],
    });
  });

  it("fjerner dupliserte ingredienser uavhengig av store bokstaver", () => {
    const recipe = parseMeal({
      idMeal: "2",
      strIngredient1: "Rice wine",
      strIngredient2: "Soy sauce",
      strIngredient3: "rice wine ",
    });
    expect(recipe.ingredients).toEqual(["Rice wine", "Soy sauce"]);
  });
});
