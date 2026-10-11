import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminPage } from './pages/AdminPage'
import { AdminProductFormPage } from './pages/AdminProductFormPage'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductDetailPage } from './pages/ProductDetailPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Área pública */}
        <Route index element={<CatalogPage />} />
        <Route path="produtos/:id" element={<ProductDetailPage />} />
        <Route path="carrinho" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />

        {/* Área administrativa: exige login */}
        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<AdminPage />} />
          <Route path="admin/produtos/novo" element={<AdminProductFormPage />} />
          <Route path="admin/produtos/:id/editar" element={<AdminProductFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
