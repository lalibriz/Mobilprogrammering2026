import { fireEvent, renderRouter, screen, waitFor } from "expo-router/testing-library";

// Kamera og lyd brukes bare av skanneren
jest.mock("expo-camera", () => ({ CameraView: () => null, useCameraPermissions: () => [null, jest.fn()] }));
jest.mock("expo-audio", () => ({ useAudioPlayer: () => ({ play: jest.fn(), seekTo: jest.fn() }) }));
jest.mock("@/components/items/DateField", () => ({ DateField: () => null }));

const meal = (id: string, name: string) => ({ idMeal: id, strMeal: name, strMealThumb: "", strInstructions: "x" });

// TheMealDB mockes: ingen nettverkskall i testen
beforeEach(() => {
  global.fetch = jest.fn(async (url: string) => {
    const meals = url.includes("lookup.php")
      ? [{ ...meal("1", "Mock Pasta"), strIngredient1: "Pasta" }]
      : url.includes("search.php")
        ? [meal("1", "Mock Pasta")]
        : [meal("1", "Mock Pasta")];
    return { ok: true, json: async () => ({ meals }) };
  }) as unknown as typeof fetch;
});

it("logg inn, lag en vare og se den igjen, og hent oppskrifter", async () => {
  renderRouter("./src/app", { initialUrl: "/" });

  // Beskyttet rute: uten token havner vi på innloggingen
  expect(await screen.findByText("Velkommen til Stocked.")).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText("Brukernavn"), "ola");
  fireEvent.changeText(screen.getByLabelText("Passord"), "hemmelig");
  fireEvent.press(screen.getByRole("button", { name: "Logg inn" }));

  // Etter innlogging: kjøleskapet
  const addButton = await screen.findByLabelText("Legg til vare", {}, { timeout: 3000 });
  const count = () => Number(screen.getByText(/ varer?$/).props.children[0]);
  const before = count();
  fireEvent.press(addButton);
  fireEvent.changeText(await screen.findByLabelText("Navn"), "Testmelk");
  fireEvent.press(screen.getByText("Legg i kjøleskapet"));
  // Listen er virtualisert, så vi sjekker telleren i stedet for en bestemt rad
  await waitFor(() => expect(count()).toBe(before + 1));

  // Oppskrifter kommer fra det mockede API-et
  fireEvent.press(screen.getByLabelText("Oppskrifter"));
  await waitFor(() => expect(screen.getAllByText("Mock Pasta").length).toBeGreaterThan(0), { timeout: 3000 });
});
