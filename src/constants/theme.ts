/**
 * Ett sted for alle designverdier.
 *
 * Hvorfor: React Native har ingen CSS-variabler eller cascade. Uten et felles
 * tema ender vi opp med hardkodede "#fff" og "padding: 12" spredt utover alle
 * komponenter, og da er det umulig å endre uttrykket ett sted. Alle
 * StyleSheet-objekter i appen leser fra dette objektet.
 */
export const LightTheme = {
  // Farger
  primary: "#023c41",
  primaryLight: "#e3ece3",
  contrast: "#260803",
  danger: "#a63d2f",
  dangerLight: "#f4ddd8",
  success: "#3f7a52",
  successLight: "#dde9df",
  warning: "#c98a1b",
  warningDark: "#8a5a0b",
  warningLight: "#f6e8c8",
  muted: "#5a6e70",
  border: "#cbd5d0",
  background: "#f3f1f2",
  // Myke flater som deles av bunnlinjen og skjemaet
  pill: "#dde7dd",
  raised: "#fbfafb",
  surface: "#ffffff",
  text: "#012a33",
  textInverted: "#ffffff",

  // Avstander. Faste trinn gir jevn rytme i UI-et.
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },

  // Hjørneradius
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },

  // Skriftstørrelser
  fontSize: {
    sm: 12,
    md: 14,
    lg: 18,
    xl: 24,
    title: 32,
  },

  // Skygger. Samme mørke grønnblå tone overalt gir et rolig uttrykk.
  shadow: {
    card: "0px 4px 12px rgba(1,42,51,0.10)",
    raised: "0px 4px 10px rgba(1,42,51,0.22)",
    well: "inset 0px 2px 4px rgba(1,42,51,0.14)",
    button: "0px 8px 16px rgba(38,8,3,0.35)",
  },
};

export type ThemeType = typeof LightTheme;

// Mørk variant: samme struktur, bare fargene byttes. Skygger er allerede
// mørke og leses fine mot mørk bakgrunn.
export const DarkTheme: ThemeType = {
  ...LightTheme,
  primary: "#3d8f8a",
  primaryLight: "#18302f",
  contrast: "#c9553d",
  danger: "#e07a68",
  dangerLight: "#3a1f1b",
  success: "#6fbf86",
  successLight: "#1c3025",
  warning: "#e0a63c",
  warningDark: "#e8bf6e",
  warningLight: "#3a2e14",
  muted: "#93a8a9",
  border: "#2c3f40",
  background: "#0e1819",
  pill: "#1a2b2c",
  raised: "#2a4143",
  surface: "#162425",
  text: "#e4eeee",
};
