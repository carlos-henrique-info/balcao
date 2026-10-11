import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { AdminChangesProvider } from './contexts/AdminChangesProvider'
import { AuthProvider } from './contexts/AuthProvider'
import { CartProvider } from './contexts/CartProvider'
import { theme } from './theme'

/** Agrupa os provedores globais da aplicação. O Router fica por fora (em App.tsx). */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <AuthProvider>
        <CartProvider>
          <AdminChangesProvider>{children}</AdminChangesProvider>
        </CartProvider>
      </AuthProvider>
    </MantineProvider>
  )
}
