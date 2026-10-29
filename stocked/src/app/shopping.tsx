import { ItemLayout } from "@/components/items/ItemLayout";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Theme } from "@/constants/theme";
import { ShoppingSearch } from "@/components/shopping/ShoppingSearch";
import { ShoppingList } from "@/components/shopping/ShoppingList";
import type { ShoppingItemData } from "@/components/shopping/ShoppingItem";
import type { FoodProduct } from "@/utils/open-food-facts";

const STORAGE_KEY = "stocked-shopping-list";

export default function ShoppingScreen() {
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

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    ).catch((error) => {
      console.error("Kunne ikke lagre handlelisten", error);
    });
  }, [items, loaded]);

  // Legg til produkt fra API-søket
  function addProduct(product: FoodProduct) {
    const name = product.product_name?.trim();
    if (!name) return;

    setItems((previous) => {
      const exists = previous.some(
        (item) =>
          item.name.toLowerCase() === name.toLowerCase()
      );

      if (exists) return previous;

      return [
        ...previous,
        {
          id: product.code || `${Date.now()}`,
          name,
          checked: false,
        },
      ];
    });
  }

  // Kryss av en vare
  function toggleItem(id: string) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  }

  // Slett en vare
  function removeItem(id: string) {
    setItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  }

  return (
    <ItemLayout>
      <View style={styles.header}>
        <Text style={styles.title}>Handleliste</Text>
        <Text style={styles.subtitle}>
          Hold oversikt over det du trenger å handle.
        </Text>
      </View>

      <ShoppingSearch onAdd={addProduct} />

      {loaded && (
        <ShoppingList
          items={items}
          onToggle={toggleItem}
          onRemove={removeItem}
          onClear={() => setItems([])}
/>
      )}
    </ItemLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  content: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xl,
    gap: Theme.spacing.lg,
  },
  header: {
    gap: Theme.spacing.sm,
  },
  title: {
    fontSize: Theme.fontSize.title,
    fontWeight: "700",
    color: Theme.text,
  },
  subtitle: {
    color: Theme.muted,
    fontSize: Theme.fontSize.md,
  },
});
