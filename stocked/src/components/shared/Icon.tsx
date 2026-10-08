import { SymbolView } from "expo-symbols";

/**
 * Alle ikonene i appen på ett sted. SF Symbols på iOS, Material Symbols på
 * Android og web, så hvert ikon trenger ett navn per plattform.
 */
const ICONS = {
  fridge: { ios: "refrigerator", android: "kitchen" },
  add: { ios: "plus", android: "add" },
  edit: { ios: "pencil", android: "edit" },
  remove: { ios: "xmark", android: "close" },
  barcode: { ios: "barcode.viewfinder", android: "barcode_scanner" },
  cart: { ios: "cart", android: "shopping_cart" },
  recipes: { ios: "fork.knife", android: "restaurant" },
  settings: { ios: "gearshape", android: "settings" },
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color: string;
};

export function Icon({ name, size = 24, color }: IconProps) {
  const { ios, android } = ICONS[name];

  return (
    <SymbolView
      name={{ ios, android, web: android }}
      size={size}
      tintColor={color}
    />
  );
}
