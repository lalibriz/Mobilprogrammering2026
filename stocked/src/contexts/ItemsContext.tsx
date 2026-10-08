import { ITEMS } from "@/data/items";
import type { Item } from "@/utils/item-schema";
import { createContext, use, useState } from "react";

type ItemsContextData = {
  fridgeName: string;
  rename: (name: string) => void;
  items: Item[];
  add: (item: Omit<Item, "id">) => void;
  update: (id: string, item: Omit<Item, "id">) => void;
  remove: (id: string) => void;
};

const ItemsContext = createContext<ItemsContextData | null>(null);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [fridgeName, setFridgeName] = useState("Mitt kjøleskap");
  const [items, setItems] = useState<Item[]>(ITEMS);

  function rename(name: string) {
    const trimmed = name.trim();

    if (trimmed) setFridgeName(trimmed);
  }

  function add(item: Omit<Item, "id">) {
    const newItem = { id: Date.now().toString(), ...item };

    setItems((prev) => [...prev, newItem]);
  }

  function update(id: string, item: Omit<Item, "id">) {
    setItems((prev) => prev.map((i) => (i.id === id ? { id, ...item } : i)));
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <ItemsContext value={{ fridgeName, rename, items, add, update, remove }}>
      {children}
    </ItemsContext>
  );
}

export function useItems() {
  const context = use(ItemsContext);

  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }

  return context;
}
