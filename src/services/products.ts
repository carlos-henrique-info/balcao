import { api, ApiError } from './api'
import {
  categoriesResponseSchema,
  productSchema,
  productsResponseSchema,
  type Category,
  type Product,
  type ProductFormValues,
  type ProductsResponse,
} from '../schemas/product'

export const PAGE_SIZE = 12

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc'

export interface ListParams {
  page: number
  search?: string
  category?: string
  sort?: SortOption
  limit?: number
  signal?: AbortSignal
}

const SORT_PARAMS: Record<Exclude<SortOption, 'relevance'>, { sortBy: string; order: 'asc' | 'desc' }> = {
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  'rating-desc': { sortBy: 'rating', order: 'desc' },
  'title-asc': { sortBy: 'title', order: 'asc' },
}

function parseOrThrow<T>(result: { success: true; data: T } | { success: false }): T {
  if (!result.success) {
    throw new ApiError('Os dados recebidos do servidor estão em um formato inesperado.')
  }
  return result.data
}

export async function listProducts({
  page,
  search,
  category,
  sort = 'relevance',
  limit = PAGE_SIZE,
  signal,
}: ListParams): Promise<ProductsResponse> {
  // A DummyJSON não combina busca e categoria no mesmo endpoint.
  const path = search?.trim()
    ? '/products/search'
    : category
      ? `/products/category/${encodeURIComponent(category)}`
      : '/products'

  const params: Record<string, string | number> = { limit, skip: (page - 1) * limit }
  if (search?.trim()) params.q = search.trim()
  if (sort !== 'relevance') Object.assign(params, SORT_PARAMS[sort])

  const { data } = await api.get<unknown>(path, { params, signal })
  return parseOrThrow(productsResponseSchema.safeParse(data))
}

export async function getProduct(id: number | string, signal?: AbortSignal): Promise<Product> {
  const { data } = await api.get<unknown>(`/products/${id}`, { signal })
  return parseOrThrow(productSchema.safeParse(data))
}

export async function listCategories(signal?: AbortSignal): Promise<Category[]> {
  const { data } = await api.get<unknown>('/products/categories', { signal })
  return parseOrThrow(categoriesResponseSchema.safeParse(data))
}

// Atenção: a DummyJSON apenas SIMULA as escritas. Ela responde como se tivesse
// salvo, mas nada é persistido no servidor.
export async function createProduct(values: ProductFormValues): Promise<Product> {
  const { data } = await api.post<unknown>('/products/add', values)
  return parseOrThrow(productSchema.safeParse(data))
}

export async function updateProduct(id: number, values: ProductFormValues): Promise<Product> {
  const { data } = await api.put<unknown>(`/products/${id}`, values)
  return parseOrThrow(productSchema.safeParse(data))
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`)
}
