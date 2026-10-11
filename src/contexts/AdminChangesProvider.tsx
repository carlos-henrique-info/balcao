import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AdminChangesContext, LOCAL_ID_START, type AdminChangesContextValue } from './AdminChangesContext'
import type { Product } from '../schemas/product'

export function AdminChangesProvider({ children }: { children: ReactNode }) {
  const [created, setCreated] = useState<Product[]>([])
  const [updated, setUpdated] = useState<Record<number, Product>>({})
  const [removedIds, setRemovedIds] = useState<number[]>([])

  const addCreated = useCallback((product: Product): Product => {
    // A API sempre devolve o mesmo id para itens novos; geramos um id local único.
    const withLocalId = { ...product, id: LOCAL_ID_START + Date.now() }
    setCreated((current) => [withLocalId, ...current])
    return withLocalId
  }, [])

  const saveUpdated = useCallback((product: Product) => {
    setUpdated((current) => ({ ...current, [product.id]: product }))
  }, [])

  const markRemoved = useCallback((id: number) => {
    setCreated((current) => current.filter((product) => product.id !== id))
    setRemovedIds((current) => (current.includes(id) ? current : [...current, id]))
  }, [])

  const value = useMemo<AdminChangesContextValue>(
    () => ({ created, updated, removedIds, addCreated, saveUpdated, markRemoved }),
    [created, updated, removedIds, addCreated, saveUpdated, markRemoved],
  )

  return <AdminChangesContext.Provider value={value}>{children}</AdminChangesContext.Provider>
}
