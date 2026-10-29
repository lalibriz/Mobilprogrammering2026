import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Theme } from "@/constants/theme";
import {
  searchProducts,
  type FoodProduct,
} from "@/utils/open-food-facts";

type Props = {
  onAdd: (product: FoodProduct) => void;
};

export function ShoppingSearch({ onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSearch() {
    if (query.trim().length < 2 || loading) return;

    setLoading(true);
    setMessage("");
    setProducts([]);

    try {
      const results = await searchProducts(query.trim());
      setProducts(results.slice(0, 8));

      if (results.length === 0) {
        setMessage("Ingen produkter funnet.");
      }
    } catch (error) {
      console.error("Feil ved produktsøk:", error);
      setMessage("Søket feilet. Sjekk terminalen.");
    } finally {
      setLoading(false);
    }
  }

  function addProduct(product: FoodProduct) {
    onAdd(product);
    setQuery("");
    setProducts([]);
    setMessage("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Legg til varer</Text>

      <TextInput
        style={styles.input}
        placeholder="Søk etter en vare..."
        placeholderTextColor={Theme.muted}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      <Pressable
        style={styles.button}
        onPress={handleSearch}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Søk</Text>
      </Pressable>

      {loading && (
        <ActivityIndicator color={Theme.primary} />
      )}

      {!!message && (
        <Text style={styles.message}>{message}</Text>
      )}

      {products.map((product, index) => (
        <Pressable
          key={`${product.code}-${index}`}
          style={styles.product}
          onPress={() => addProduct(product)}
        >
          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {product.product_name}
            </Text>

            {!!product.brands && (
              <Text style={styles.brand}>
                {product.brands}
              </Text>
            )}
          </View>

          <Text style={styles.addText}>+ Legg til</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.surface,
    padding: Theme.spacing.lg,
    borderRadius: Theme.radius.xl,
    gap: Theme.spacing.md,
  },
  heading: {
    color: Theme.text,
    fontSize: Theme.fontSize.lg,
    fontWeight: "700",
  },
  input: {
    backgroundColor: Theme.background,
    borderWidth: 1,
    borderColor: Theme.border,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    color: Theme.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: Theme.primary,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: Theme.textInverted,
    fontWeight: "700",
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: Theme.text,
    fontSize: 16,
  },
  brand: {
    color: Theme.muted,
    fontSize: 13,
  },
  addText: {
    color: Theme.primary,
    fontWeight: "700",
  },
  message: {
    color: Theme.danger,
    fontSize: Theme.fontSize.md,
  },
});
