import { ItemLayout } from "@/components/items/ItemLayout";
import {
  ScrollView,
  Text,
  View,
} from "react-native";

import { makeStyles } from "@/contexts/ThemeContext";
import { ShoppingSearch } from "@/components/shopping/ShoppingSearch";
import { ShoppingList } from "@/components/shopping/ShoppingList";
import { useShopping } from "@/contexts/ShoppingContext";
import type { FoodProduct } from "@/utils/open-food-facts";

export default function ShoppingScreen() {
  const styles = useStyles();
  const { items, loaded, addItems, toggleItem, removeItem, clearItems } =
    useShopping();

  // Legg til produkt fra API-søket
  function addProduct(product: FoodProduct) {
    const name = product.product_name?.trim();
    if (!name) return;
    addItems([name]);
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
          onClear={clearItems}
        />
      )}
    </ItemLayout>
  );
}

const useStyles = makeStyles((Theme) => ({
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
}));
