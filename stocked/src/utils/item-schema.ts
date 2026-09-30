import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string().min(1, "Id is required"),
  name: z.string().min(2, "Navn må ha minst 2 tegn"),
  quantity: z
    .number("Antall må være et tall")
    .int("Antall må være et helt tall")
    .positive("Antall må være minst 1"),
  expiresAt: z.iso.date("Dato må være på formen ÅÅÅÅ-MM-DD"),
});

export type Item = z.infer<typeof ItemSchema>;
