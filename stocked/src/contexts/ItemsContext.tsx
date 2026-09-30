import { ITEMS } from "@/data/items";
import type { Item } from "@/utils/item-schema";
import { createContext, use, useState } from "react";

type ItemsContextData = {
  items: Item[];
  add: (item: Omit<Item, "id">) => void;
  remove: (id: string) => void;
};

const ItemsContext = createContext<ItemsContextData | null>(null);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(ITEMS);

  function add(item: Omit<Item, "id">) {
    const newItem = { id: Date.now().toString(), ...item };

    setItems((prev) => [...prev, newItem]);
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return <ItemsContext value={{ items, add, remove }}>{children}</ItemsContext>;
}

export function useItems() {
  const context = use(ItemsContext);

  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }

  return context;
}
