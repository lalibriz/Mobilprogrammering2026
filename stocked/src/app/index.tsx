import { FilterBar } from "@/components/items/FilterBar";
import { ItemHeader } from "@/components/items/ItemHeader";
import { ItemLayout } from "@/components/items/ItemLayout";
import { ItemList } from "@/components/items/ItemList";
import { useItemEditor } from "@/contexts/ItemEditorContext";
import { useItems } from "@/contexts/ItemsContext";
import type { ExpiryStatus } from "@/utils/expiry";
import { useState } from "react";

export default function Index() {
  const { fridgeName, rename, items, remove } = useItems();
  const { openAdd, openEdit } = useItemEditor();
  const [activeFilters, setActiveFilters] = useState<ExpiryStatus[]>([]);

  function toggleFilter(status: ExpiryStatus) {
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  }

  return (
    <ItemLayout>
      <ItemHeader name={fridgeName} onRename={rename} count={items.length} />
      <FilterBar
        items={items}
        activeFilters={activeFilters}
        onToggle={toggleFilter}
        onClear={() => setActiveFilters([])}
      />
      <ItemList
        items={items}
        onEdit={openEdit}
        onRemove={remove}
        onAdd={openAdd}
        activeFilters={activeFilters}
      />
    </ItemLayout>
  );
}
