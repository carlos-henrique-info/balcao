import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { fakeSession, renderWithProviders } from '../test/utils'
import { ProtectedRoute } from './ProtectedRoute'

function Tree() {
  return (
    <Routes>
      <Route path="/login" element={<h1>Tela de login</h1>} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<h1>Painel admin</h1>} />
      </Route>
    </Routes>
  )
}

describe('ProtectedRoute', () => {
  it('redireciona para o login quando não há sessão', () => {
    renderWithProviders(<Tree />, { route: '/admin', session: null })
    expect(screen.getByRole('heading', { name: 'Tela de login' })).toBeInTheDocument()
    expect(screen.queryByText('Painel admin')).not.toBeInTheDocument()
  })

  it('libera o acesso quando o usuário está logado', () => {
    renderWithProviders(<Tree />, { route: '/admin', session: fakeSession })
    expect(screen.getByRole('heading', { name: 'Painel admin' })).toBeInTheDocument()
  })
})
