/**
 * Ett sted for alle designverdier.
 *
 * Hvorfor: React Native har ingen CSS-variabler eller cascade. Uten et felles
 * tema ender vi opp med hardkodede "#fff" og "padding: 12" spredt utover alle
 * komponenter, og da er det umulig å endre uttrykket ett sted. Alle
 * StyleSheet-objekter i appen leser fra dette objektet.
 */
export const Theme = {
  // Farger
  primary: "#0a8f8a",
  primaryLight: "#c9f5ef",
  secondary: "#19c3b1",
  contrast: "#ff7a59",
  danger: "#d32f2f",
  success: "#388e3c",
  warning: "#f59e0b",
  warningLight: "#fef3c7",
  dangerLight: "#fee2e2",
  successLight: "#dcfce7",
  muted: "#6b7280",
  border: "#b6c9d6",
  background: "#e6eafb",
  // Soft "pill" surfaces shared by the bottom bar and the form
  pill: "#d6dcf3",
  raised: "#fafbff",
  shadowTint: "60,70,140",
  surface: "#ffffff",
  shelf: "rgba(255,255,255,0.75)",
  shelfEdge: "#8cc9d6",
  text: "#111827",
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
  },

  // Skriftstørrelser
  fontSize: {
    sm: 12,
    md: 14,
    lg: 18,
    xl: 24,
  },
} as const;
