import { createContext } from 'react'
import type { Product } from '../schemas/product'

export type CartProduct = Pick<Product, 'id' | 'title' | 'price' | 'discountPercentage' | 'thumbnail'>

export interface CartItem {
  product: CartProduct
  quantity: number
}

export interface CartContextValue {
  items: CartItem[]
  totalItems: number
  /** Soma dos preços já com desconto. */
  subtotal: number
  addItem: (product: CartProduct, quantity?: number) => void
  setQuantity: (productId: number, quantity: number) => void
  removeItem: (productId: number) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
