import { LoginSchema } from "./login-schema";

describe("LoginSchema", () => {
  it("godtar gyldig innlogging og trimmer brukernavnet", () => {
    const result = LoginSchema.safeParse({ username: "  ola ", password: "hemmelig" });
    expect(result.success && result.data.username).toBe("ola");
  });

  it("gir én feil per felt", () => {
    const result = LoginSchema.safeParse({ username: "ol", password: "123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.username).toEqual(["Brukernavn må ha minst 3 tegn"]);
      expect(errors.password).toEqual(["Passord må ha minst 6 tegn"]);
    }
  });
});
