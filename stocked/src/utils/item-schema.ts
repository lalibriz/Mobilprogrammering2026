import { z } from "zod";

// Navnet må starte med en bokstav eller et tall og kan ellers bare ha vanlige tegn

export const ItemSchema = z.object({
  id: z.string().min(1, "Id is required"),
  name: z
    .string()
    .trim()
    .min(2, "Navn må ha minst 2 tegn")
    .max(40, "Navn kan ha maks 40 tegn")
    .regex(/\p{L}/u, "Navn må inneholde minst én bokstav")
    .regex(
      /^[\p{L}\p{N}][\p{L}\p{N} .,'’&%()/-]*$/u,
      "Navn kan bare inneholde bokstaver, tall og vanlige tegn som - ' . , & % ( ) /",
    ),
  quantity: z
    .number("Antall må være et tall")
    .int("Antall må være et helt tall")
    .positive("Antall må være minst 1"),
  expiresAt: z.iso.date("Dato må være på formen ÅÅÅÅ-MM-DD"),
});

export type Item = z.infer<typeof ItemSchema>;
