import type { Item } from "@/utils/item-schema";
import { addDays } from "@/utils/expiry";

// Datoene regnes ut fra i dag, slik at dummydataene alltid viser en blanding
// av utgåtte, snart-utgåtte og ferske varer.
export const ITEMS: Item[] = [
  { id: "1", name: "Melk", quantity: 1, expiresAt: addDays(1) },
  { id: "2", name: "Egg", quantity: 6, expiresAt: addDays(9) },
  { id: "3", name: "Yoghurt", quantity: 2, expiresAt: addDays(-2) },
  { id: "4", name: "Ost", quantity: 1, expiresAt: addDays(21) },
  { id: "5", name: "Tomater", quantity: 4, expiresAt: addDays(3) },
  { id: "6", name: "Smør", quantity: 1, expiresAt: addDays(40) },
];
