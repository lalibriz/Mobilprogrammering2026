import { describe, expect, it } from "vitest";
import { ItemSchema } from "./item-schema";

const valid = { id: "1", quantity: 1, expiresAt: "2026-10-12" };
const parse = (name: string) => ItemSchema.safeParse({ ...valid, name });

describe("ItemSchema name", () => {
  it.each([
    "Melk",
    "Økologisk melk",
    "Brød 750g",
    "Coca-Cola 0,5l",
    "Ben & Jerry's",
  ])("godtar %s", (name) => {
    expect(parse(name).success).toBe(true);
  });

  it.each([
    ["", "for kort"],
    ["a", "for kort"],
    ["   ", "bare mellomrom"],
    ["12", "bare tall"],
    ["!!!", "bare tegn"],
    ["--melk", "starter med tegn"],
    ["Melk 🥛", "emoji"],
    ["<script>", "spesialtegn"],
    ["a".repeat(41), "for langt"],
  ])("avviser %j (%s)", (name) => {
    expect(parse(name).success).toBe(false);
  });

  it("trimmer mellomrom rundt navnet", () => {
    const result = parse("  Melk  ");

    expect(result.success && result.data.name).toBe("Melk");
  });
});
