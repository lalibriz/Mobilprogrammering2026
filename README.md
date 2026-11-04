# Stocked

Stocked holder oversikt over hva som ligger i kjøleskapet og når det går ut på dato. Appen foreslår oppskrifter (TheMealDB) ut fra varene du har liggende i kjøleskapet, og har en handleliste der varer kan søkes opp i Open Food Facts eller skannes med strekkode.

## Start appen

```bash
npm install
npx expo start      # trykk i for iOS-simulator, a for Android, eller skann QR-koden med Expo Go
```

Innloggingen er lokal og falsk: bruk et brukernavn på minst 3 tegn og et passord på minst 6 tegn. Tokenet lagres i SecureStore.

## Tester

```bash
npm test            # Jest (jest-expo) + Testing Library
npx tsc --noEmit    # typesjekk
```

- Enhetstester: `src/utils/*.test.ts` (Zod-skjemaene, utløpsdato, oppskriftsmatching, MealDB-parsing).
- Komponenttest: `src/__tests__/ItemForm.test.tsx` (feil per felt).
- Hovedflyt: `src/__tests__/main-flow.test.tsx` rendrer hele Expo Router-appen med `fetch` mocket: beskyttet rute, logg inn, legg til vare, se oppskrifter.

## Hovedflyt

Logg inn → legg til en vare med **+** (navn, antall, utløpsdato) → varen vises i listen sortert etter utløp → oppskrifter-fanen viser oppskrifter basert på varene.

## Hvor ting ligger

| Hva                 | Hvor                                                                                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ruter (Expo Router) | `src/app/`: `_layout.tsx` (stack med `Stack.Protected`), `login.tsx`, `(tabs)/` (hjem, handleliste, oppskrifter, innstillinger), `scanner.tsx`, `recipes/[id].tsx`                     |
| Datalag             | `src/contexts/` (Auth, Items, Shopping, Theme, lagret i SecureStore/AsyncStorage), `src/queries/recipes.ts` (TanStack Query), `src/utils/mealdb.ts` og `open-food-facts.ts` (API-kall) |
| Validering          | `src/utils/item-schema.ts`, `src/utils/login-schema.ts` (Zod)                                                                                                                          |
| Komponenter         | `src/components/{items,recipes,shopping,shared}`                                                                                                                                       |
| Tema                | `src/constants/theme.ts`, `src/contexts/ThemeContext.tsx`                                                                                                                              |

## Valgene som preger koden

1. **Context for lokal tilstand, TanStack Query for alt som kommer fra nett.** Varer, handleliste og innlogging er lokale og bor i contexts. Oppskrifter hentes med `useQuery` (caching, lasting og feil/«prøv igjen» uten egen state).
2. **Zod er kilden til sannhet for data over grenser.** `Item` er typen avledet fra skjemaet, og samme skjema validerer skjemaet i appen og dataene som leses fra AsyncStorage.
3. **Responsivt via `useWindowDimensions` og safe-area.** Lister er `FlatList` med to kolonner i bred visning/landscape, og innholdet har maks bredde. Appen støtter portrett og landscape.
