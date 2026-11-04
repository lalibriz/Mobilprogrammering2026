import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().trim().min(3, "Brukernavn må ha minst 3 tegn"),
  password: z.string().min(6, "Passord må ha minst 6 tegn"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
