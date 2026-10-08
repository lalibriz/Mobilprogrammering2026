import { FridgeHeader } from "@/components/items/FridgeHeader";
import { ItemLayout } from "@/components/items/ItemLayout";
import { ItemList } from "@/components/items/ItemList";
import { useItemEditor } from "@/contexts/ItemEditorContext";
import { useItems } from "@/contexts/ItemsContext";
import type { ExpiryStatus } from "@/utils/expiry";
import { useState } from "react";

export default function Index() {
  const { fridgeName, rename, items, remove } = useItems();
  const { openEdit } = useItemEditor();
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
        name={fridgeName}
        onRename={rename}
        items={items}
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
      />
      <ItemList
        items={items}
        onEdit={openEdit}
        onRemove={remove}
        activeFilters={activeFilters}
      />
    </ItemLayout>
  );
}
