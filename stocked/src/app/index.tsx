import { FridgeHeader } from "@/components/items/FridgeHeader";
import { ItemForm } from "@/components/items/ItemForm";
import { ItemLayout } from "@/components/items/ItemLayout";
import { ItemList } from "@/components/items/ItemList";
import { useItems } from "@/contexts/ItemsContext";

export default function Index() {
  const { items, add, remove } = useItems();

  return (
    <ItemLayout>
      <FridgeHeader items={items} />
      <ItemList items={items} onRemove={remove} />
      <ItemForm onAdd={add} />
    </ItemLayout>
  );
}
