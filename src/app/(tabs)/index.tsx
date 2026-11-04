import { FilterBar } from "@/components/items/FilterBar";
import { ItemHeader } from "@/components/items/ItemHeader";
import { ItemList } from "@/components/items/ItemList";
import { useItemEditor } from "@/contexts/ItemEditorContext";
import { useItems } from "@/contexts/ItemsContext";
import type { ExpiryStatus } from "@/utils/expiry";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export default function Index() {
  const { fridgeName, rename, items, remove } = useItems();
  const { openAdd, openEdit } = useItemEditor();
  const Theme = useTheme();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<ExpiryStatus[]>([]);

  function toggleFilter(status: ExpiryStatus) {
    setActiveFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  }

  return (
    <ItemList
      items={items}
      onEdit={openEdit}
      onRemove={remove}
      onAdd={openAdd}
      activeFilters={activeFilters}
      query={query}
      header={
        <View style={{ gap: 16, marginBottom: 16 }}>
          <ItemHeader name={fridgeName} onRename={rename} count={items.length} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Søk i kjøleskapet"
            placeholderTextColor={Theme.muted}
            accessibilityLabel="Søk i kjøleskapet"
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={{
              minHeight: 48,
              borderRadius: 24,
              paddingHorizontal: Theme.spacing.lg,
              backgroundColor: Theme.pill,
              color: Theme.text,
            }}
          />
          <FilterBar
            items={items}
            activeFilters={activeFilters}
            onToggle={toggleFilter}
            onClear={() => setActiveFilters([])}
          />
        </View>
      }
    />
  );
}
