import { useRequest } from './useRequest'
import { ApiError } from '../services/api'
import { getProduct, listCategories, listProducts, type SortOption } from '../services/products'

interface UseProductsParams {
  page: number
  search: string
  category: string
  sort: SortOption
}

export function useProducts({ page, search, category, sort }: UseProductsParams) {
  return useRequest(
    (signal) => listProducts({ page, search, category, sort, signal }),
    [page, search, category, sort],
  )
}

export function useProduct(id: string | undefined) {
  return useRequest(
    (signal) => (id ? getProduct(id, signal) : Promise.reject(new ApiError('Produto inválido.', { status: 404 }))),
    [id],
  )
}

export function useCategories() {
  return useRequest((signal) => listCategories(signal), [])
}
