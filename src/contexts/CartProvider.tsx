import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CartContext, type CartContextValue, type CartItem, type CartProduct } from './CartContext'
import { discountedPrice } from '../utils/format'

const CART_KEY = 'balcao.cart'

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

interface CartProviderProps {
  children: ReactNode
  /** Permite iniciar com itens em memória (útil em testes). */
  initialItems?: CartItem[]
}

export function CartProvider({ children, initialItems }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(() => initialItems ?? readStoredCart())

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      if (existing) {
        // Imutabilidade: criamos um novo array e um novo objeto para o item alterado.
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...current, { product, quantity }]
    })
  }, [])

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.product.id !== productId)
        : current.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    )
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + discountedPrice(item.product.price, item.product.discountPercentage) * item.quantity,
        0,
      ),
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [items, addItem, setQuantity, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
