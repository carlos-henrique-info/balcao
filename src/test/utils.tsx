import type { ReactElement } from 'react'
import { MantineProvider } from '@mantine/core'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminChangesProvider } from '../contexts/AdminChangesProvider'
import { AuthProvider } from '../contexts/AuthProvider'
import { CartProvider } from '../contexts/CartProvider'
import type { CartItem } from '../contexts/CartContext'
import type { Session } from '../schemas/auth'
import type { Product } from '../schemas/product'
import { theme } from '../theme'

interface RenderOptions {
  route?: string
  session?: Session | null
  cartItems?: CartItem[]
}

/** Renderiza com todos os provedores, usando contextos em memória (sem localStorage). */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/', session = null, cartItems = [] }: RenderOptions = {},
) {
  return render(
    <MantineProvider theme={theme} env="test">
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider initialSession={session}>
          <CartProvider initialItems={cartItems}>
            <AdminChangesProvider>{ui}</AdminChangesProvider>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    </MantineProvider>,
  )
}

export const fakeSession: Session = {
  token: 'jwt-de-teste',
  user: { id: 1, username: 'emilys', firstName: 'Emily' },
}

export const fakeProduct: Product = {
  id: 7,
  title: 'Perfume Aurora',
  description: 'Fragrância floral com notas de jasmim e baunilha.',
  category: 'fragrances',
  price: 100,
  discountPercentage: 10,
  rating: 4.5,
  stock: 12,
  tags: ['perfume'],
  thumbnail: 'https://example.com/aurora.png',
  images: [],
  reviews: [],
}
