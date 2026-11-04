import { toEnglish, toNorwegian } from "../data/ingredients-no";
import { matchRecipe } from "./recipe-match";

describe("ingredient dictionary", () => {
  it("mapper norsk til engelsk uavhengig av store bokstaver og mellomrom", () => {
    expect(toEnglish(" Melk ")).toBe("milk");
    expect(toEnglish("ukjent")).toBeUndefined();
  });

  it("mapper engelsk til norsk med fallback", () => {
    expect(toNorwegian("milk")).toBe("Melk");
    expect(toNorwegian("Saffron")).toBe("Saffron");
  });
});

describe("matchRecipe", () => {
  it("deler ingrediensene i have og missing", () => {
    const m = matchRecipe(["Milk", "Egg", "Flour"], ["milk", "egg"]);
    expect(m.have).toEqual(["Milk", "Egg"]);
    expect(m.missing).toEqual(["Flour"]);
    expect(m.ratio).toBeCloseTo(2 / 3);
  });

  it("ignorerer store bokstaver og mellomrom", () => {
    expect(matchRecipe(["Milk "], ["milk"]).ratio).toBe(1);
  });

  it("gir ratio 0 uten ingredienser", () => {
    expect(matchRecipe([], ["milk"]).ratio).toBe(0);
  });
});
