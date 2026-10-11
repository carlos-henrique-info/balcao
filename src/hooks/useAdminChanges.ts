import { useContext } from 'react'
import { AdminChangesContext, type AdminChangesContextValue } from '../contexts/AdminChangesContext'

export function useAdminChanges(): AdminChangesContextValue {
  const context = useContext(AdminChangesContext)
  if (context === null) {
    throw new Error('useAdminChanges precisa ser usado dentro de um <AdminChangesProvider>.')
  }
  return context
}
