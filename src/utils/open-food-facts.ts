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

  await new Promise(resolve => setTimeout(resolve, 1000));

  const response = await fetch(
  `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`,
  {
    signal: AbortSignal.timeout(10000),
  }
);

  if (!response.ok) {
  console.log("API-feil:", response.status, response.statusText);
  throw new Error("Kunne ikke hente produkter");
}

  const data = await response.json();

  return (data.products ?? []).filter(
    (product: FoodProduct) =>
      Boolean(product.product_name?.trim())
  );
}
