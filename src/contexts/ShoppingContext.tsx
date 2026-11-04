import type { ShoppingItemData } from "@/components/shopping/ShoppingItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useEffect, useState } from "react";

type ShoppingContextData = {
  items: ShoppingItemData[];
  loaded: boolean;
  addItems: (names: string[]) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
};

const ShoppingContext = createContext<ShoppingContextData | null>(null);

const STORAGE_KEY = "stocked-shopping-list";

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingItemData[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Hent handlelisten når appen åpnes
  useEffect(() => {
    async function loadItems() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (error) {
        console.error("Kunne ikke hente handlelisten", error);
      } finally {
        setLoaded(true);
      }
    }

    loadItems();
  }, []);

  // Lagre handlelisten når noe endres
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch((error) => {
      console.error("Kunne ikke lagre handlelisten", error);
    });
  }, [items, loaded]);

  // Legger til varer som ikke allerede ligger på listen
  function addItems(names: string[]) {
    setItems((previous) => {
      const seen = new Set(previous.map((item) => item.name.toLowerCase()));
      const added: ShoppingItemData[] = [];

      names.forEach((raw, index) => {
        const name = raw.trim();
        if (!name || seen.has(name.toLowerCase())) return;
        seen.add(name.toLowerCase());
        added.push({ id: `${Date.now()}-${index}`, name, checked: false });
      });

      return added.length ? [...previous, ...added] : previous;
    });
  }

  function toggleItem(id: string) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((previous) => previous.filter((item) => item.id !== id));
  }

  function clearItems() {
    setItems([]);
  }

  return (
    <ShoppingContext
      value={{ items, loaded, addItems, toggleItem, removeItem, clearItems }}
    >
      {children}
    </ShoppingContext>
  );
}

export function useShopping() {
  const context = use(ShoppingContext);
  if (!context) throw new Error("useShopping må brukes innenfor ShoppingProvider");
  return context;
}
