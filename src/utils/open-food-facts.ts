export type FoodProduct = {
  code: string;
  product_name?: string;
  brands?: string;
};

export async function searchProducts(
  query: string
): Promise<FoodProduct[]> {
  const params = new URLSearchParams({
    search_terms: query.trim(),
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "15",
    fields: "code,product_name,brands",
  });

  const response = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Kunne ikke hente produkter");
  }

  const data = await response.json();

  return (data.products ?? []).filter(
    (product: FoodProduct) =>
      Boolean(product.product_name?.trim())
  );
}
