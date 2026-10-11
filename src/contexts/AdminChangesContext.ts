import { createContext } from 'react'
import type { Product } from '../schemas/product'

/** A DummyJSON não persiste escritas, então guardamos as alterações da sessão aqui. */
export const LOCAL_ID_START = 100_000

export interface AdminChangesContextValue {
  created: Product[]
  updated: Record<number, Product>
  removedIds: number[]
  addCreated: (product: Product) => Product
  saveUpdated: (product: Product) => void
  markRemoved: (id: number) => void
}

export const AdminChangesContext = createContext<AdminChangesContextValue | null>(null)
