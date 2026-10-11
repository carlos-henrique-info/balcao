import { useContext } from 'react'
import { CartContext, type CartContextValue } from '../contexts/CartContext'

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (context === null) {
    throw new Error('useCart precisa ser usado dentro de um <CartProvider>.')
  }
  return context
}
