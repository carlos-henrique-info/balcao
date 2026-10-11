import { useEffect, useState } from 'react'
import { Alert, Box, Button, Group, LoadingOverlay, Pagination, Stack, Text, Title } from '@mantine/core'
import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { SearchFilters } from '../components/SearchFilters'
import { StateMessage } from '../components/StateMessage'
import { useDebounce } from '../hooks/useDebounce'
import { useCategories, useProducts } from '../hooks/useProducts'
import { PAGE_SIZE, type SortOption } from '../services/products'

const VALID_SORTS: SortOption[] = ['relevance', 'price-asc', 'price-desc', 'rating-desc', 'title-asc']

export function CatalogPage() {
  // Filtros e página vivem na URL: o usuário pode compartilhar ou recarregar a busca.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('categoria') ?? ''
  const sortParam = searchParams.get('ordem') as SortOption | null
  const sort: SortOption = sortParam && VALID_SORTS.includes(sortParam) ? sortParam : 'relevance'
  const page = Math.max(1, Number(searchParams.get('pagina')) || 1)

  const [searchText, setSearchText] = useState(query)
  const debouncedSearch = useDebounce(searchText.trim(), 400)

  const { data, error, loading, reload } = useProducts({ page, search: query, category, sort })
  const { data: categories } = useCategories()

  function updateParams(changes: Record<string, string>) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setSearchParams(next)
  }

  // Aplica a busca na URL só depois do debounce. A API não combina busca com
  // categoria, então buscar limpa a categoria escolhida.
  useEffect(() => {
    if (debouncedSearch === query) return
    const next = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      next.set('q', debouncedSearch)
      next.delete('categoria')
    } else {
      next.delete('q')
    }
    next.delete('pagina')
    setSearchParams(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  function handleCategoryChange(value: string) {
    setSearchText('')
    updateParams({ categoria: value, q: '', pagina: '' })
  }

  function clearFilters() {
    setSearchText('')
    setSearchParams(new URLSearchParams())
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0
  const hasFilters = Boolean(query || category)

  return (
    <Stack gap="lg">
      <div>
        <Title order={1}>Catálogo</Title>
        <Text c="dimmed">Procure por nome, filtre por categoria e monte seu carrinho.</Text>
      </div>

      <SearchFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        category={category}
        onCategoryChange={handleCategoryChange}
        categories={categories ?? []}
        sort={sort}
        onSortChange={(value) => updateParams({ ordem: value === 'relevance' ? '' : value, pagina: '' })}
      />

      {error && !data && (
        <Alert color="red" title="Não foi possível carregar os produtos" role="alert">
          <Group justify="space-between">
            <Text size="sm">{error.message}</Text>
            <Button size="xs" variant="white" color="red" onClick={reload}>
              Tentar novamente
            </Button>
          </Group>
        </Alert>
      )}

      {data && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed" aria-live="polite">
            {data.total} {data.total === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </Text>
          {hasFilters && (
            <Button variant="subtle" size="compact-sm" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </Group>
      )}

      <Box pos="relative" mih={240}>
        <LoadingOverlay visible={loading} zIndex={5} overlayProps={{ blur: 1 }} loaderProps={{ 'aria-label': 'Carregando produtos' }} />
        {data && data.products.length > 0 && <ProductGrid products={data.products} />}
        {data && data.products.length === 0 && (
          <StateMessage
            title="Nada por aqui"
            message="Nenhum produto corresponde à sua busca. Tente outro termo ou remova os filtros."
          >
            <Button variant="light" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </StateMessage>
        )}
      </Box>

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            total={totalPages}
            value={Math.min(page, totalPages)}
            onChange={(value) => {
              updateParams({ pagina: value === 1 ? '' : String(value) })
              window.scrollTo({ top: 0 })
            }}
            getControlProps={(control) => {
              if (control === 'previous') return { 'aria-label': 'Página anterior' }
              if (control === 'next') return { 'aria-label': 'Próxima página' }
              return {}
            }}
          />
        </Group>
      )}
    </Stack>
  )
}
