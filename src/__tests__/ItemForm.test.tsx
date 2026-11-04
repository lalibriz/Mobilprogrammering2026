import { ItemForm } from "@/components/items/ItemForm";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { fireEvent, render, screen } from "@testing-library/react-native";

// Datovelgeren er en native komponent som ikke finnes i Jest
jest.mock("@/components/items/DateField", () => ({ DateField: () => null }));

function setup() {
  const onSubmit = jest.fn();
  render(
    <ThemeProvider>
      <ItemForm onSubmit={onSubmit} />
    </ThemeProvider>,
  );
  return onSubmit;
}

describe("ItemForm", () => {
  it("viser feil under feltet og sender ikke inn ugyldig skjema", async () => {
    const onSubmit = setup();
    fireEvent.changeText(await screen.findByLabelText("Navn"), "a");
    fireEvent.press(screen.getByText("Legg i kjøleskapet"));

    expect(screen.getByText("Navn må ha minst 2 tegn")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sender inn gyldig vare", async () => {
    const onSubmit = setup();
    fireEvent.changeText(await screen.findByLabelText("Navn"), "Melk");
    fireEvent.press(screen.getByText("Legg i kjøleskapet"));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Melk", quantity: 1 }),
    );
  });
});
