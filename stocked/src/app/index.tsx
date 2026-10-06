import { FridgeHeader } from "@/components/items/FridgeHeader";
import { ItemForm } from "@/components/items/ItemForm";
import { ItemLayout } from "@/components/items/ItemLayout";
import { ItemList } from "@/components/items/ItemList";
import { useItems } from "@/contexts/ItemsContext";
import type { ExpiryStatus } from "@/utils/expiry";
import { useState } from "react";

export default function Index() {
  const { items, add, remove } = useItems();
  const [activeFilters, setActiveFilters] = useState<ExpiryStatus[]>([]);

  const toggleFilter = (status: ExpiryStatus) =>
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );

  return (
    <ItemLayout>
      <FridgeHeader
        items={items}
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
      />
      <ItemList
        items={items}
        onRemove={remove}
        activeFilters={activeFilters}
      />
      <ItemForm onAdd={add} />
    </ItemLayout>
  );
}
