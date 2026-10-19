import { ITEMS } from "@/data/items";
import { Loading } from "@/components/shared/Loading";
import { ItemSchema, type Item } from "@/utils/item-schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useEffect, useState } from "react";
import { z } from "zod";

type ItemsContextData = {
  fridgeName: string;
  rename: (name: string) => void;
  items: Item[];
  add: (item: Omit<Item, "id">) => void;
  update: (id: string, item: Omit<Item, "id">) => void;
  remove: (id: string) => void;
};

const ItemsContext = createContext<ItemsContextData | null>(null);

const STORAGE_KEY = "stocked:v1";

const StoredSchema = z.object({
  fridgeName: z.string(),
  items: ItemSchema.array(),
});

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [fridgeName, setFridgeName] = useState("Mitt kjøleskap");
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);

        if (raw) {
          const stored = StoredSchema.parse(JSON.parse(raw));

          setFridgeName(stored.fridgeName);
          setItems(stored.items);
        }
      } catch (error) {
        // Korrupte eller gamle data: behold standardverdiene
        console.error("Kunne ikke laste data:", error);
      } finally {
        setLoaded(true);
      }
    }

    load();
  }, []);

  // Ikke lagre før lasting er ferdig, ellers overskrives lagrede data
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ fridgeName, items }),
    ).catch((error) => console.error("Kunne ikke lagre data:", error));
  }, [fridgeName, items, loaded]);

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

  if (!loaded) return <Loading />;

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
