import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  FoodProduct,
  searchProducts,
} from "@/utils/open-food-facts";

import { Theme } from "@/constants/theme";

type Props = {
  onAdd: (product: FoodProduct) => void;
};

export function ShoppingSearch({ onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    if (query.trim().length < 2) {
      setProducts([]);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    const timer = setTimeout(async () => {
      try {
        const results = await searchProducts(query);

        if (active) {
          setProducts(results.slice(0, 8));
        }
      } catch {
        if (active) {
          setProducts([]);
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  function addProduct(product: FoodProduct) {
    onAdd(product);
    setQuery("");
    setProducts([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Legg til varer
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Søk etter en vare..."
        placeholderTextColor={Theme.muted}
        value={query}
        onChangeText={setQuery}
      />

      {loading && (
        <ActivityIndicator color={Theme.primary} />
      )}

      {error && (
        <Text style={styles.message}>
          Kunne ikke hente varer. Prøv igjen.
        </Text>
      )}

      {!loading &&
        !error &&
        products.map((product, index) => (
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
    borderColor: Theme.border,
    borderWidth: 1,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    color: Theme.text,
    fontSize: 16,
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
    fontWeight: "500",
  },
  brand: {
    color: Theme.muted,
    fontSize: 13,
  },
  addText: {
    color: Theme.primary,
    fontWeight: "700",
    marginLeft: 8,
  },
  message: {
    color: Theme.muted,
    fontSize: 14,
  },
});
