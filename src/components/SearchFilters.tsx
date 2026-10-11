import { Group, Select, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import type { Category } from '../schemas/product'
import type { SortOption } from '../services/products'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'rating-desc', label: 'Melhor avaliação' },
  { value: 'title-asc', label: 'Nome (A–Z)' },
]

interface SearchFiltersProps {
  searchText: string
  onSearchChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: Category[]
  sort: SortOption
  onSortChange: (value: SortOption) => void
}

export function SearchFilters({
  searchText,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  sort,
  onSortChange,
}: SearchFiltersProps) {
  return (
    <Group align="flex-end" gap="md" grow preventGrowOverflow={false} role="search" aria-label="Filtros do catálogo">
      <TextInput
        label="Buscar produto"
        placeholder="Ex.: notebook, perfume, sofá"
        leftSection={<IconSearch size={16} aria-hidden />}
        value={searchText}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        style={{ flexBasis: '20rem', flexGrow: 2 }}
      />
      <Select
        label="Categoria"
        placeholder="Todas as categorias"
        data={categories.map((item) => ({ value: item.slug, label: item.name }))}
        value={category || null}
        onChange={(value) => onCategoryChange(value ?? '')}
        clearable
        searchable
        nothingFoundMessage="Nenhuma categoria"
        style={{ flexBasis: '12rem' }}
      />
      <Select
        label="Ordenar por"
        data={SORT_OPTIONS}
        value={sort}
        onChange={(value) => onSortChange((value as SortOption | null) ?? 'relevance')}
        allowDeselect={false}
        style={{ flexBasis: '12rem' }}
      />
    </Group>
  )
}
