import { FridgeHeader } from "@/components/items/FridgeHeader";
import { ItemLayout } from "@/components/items/ItemLayout";
import { ItemList } from "@/components/items/ItemList";
import { useItemEditor } from "@/contexts/ItemEditorContext";
import { useItems } from "@/contexts/ItemsContext";
import { expiryStatus, type ExpiryStatus } from "@/utils/expiry";
import { useState } from "react";

export default function Index() {
  const { fridgeName, rename, items, remove } = useItems();
  const { openAdd, openEdit } = useItemEditor();
  const [activeFilters, setActiveFilters] = useState<ExpiryStatus[]>([]);

  const toggleFilter = (status: ExpiryStatus) =>
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );

  const drawers = (
    [
      ["fresh", "ferske"],
      ["soon", "snart ute"],
      ["expired", "utgått"],
    ] as const
  ).map(([status, label]) => ({
    label,
    count: items.filter((i) => expiryStatus(i.expiresAt) === status).length,
    active: activeFilters.includes(status),
    onPress: () => toggleFilter(status),
  }));

  return (
    <ItemLayout
      drawers={drawers}
      header={<FridgeHeader name={fridgeName} onRename={rename} items={items} />}
    >
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
