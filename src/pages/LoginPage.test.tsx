import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../services/api'
import { fakeSession, renderWithProviders } from '../test/utils'
import { LoginPage } from './LoginPage'

vi.mock('../services/auth', () => ({ login: vi.fn() }))
import { login } from '../services/auth'

function Tree() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<h1>Painel admin</h1>} />
    </Routes>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(login).mockReset()
  })

  it('mostra erros de validação do Zod sem chamar a API', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Tree />, { route: '/login' })

    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Informe o usuário')).toBeInTheDocument()
    expect(screen.getByText('Informe a senha')).toBeInTheDocument()
    expect(login).not.toHaveBeenCalled()
  })

  it('faz login e redireciona para a área administrativa', async () => {
    vi.mocked(login).mockResolvedValue(fakeSession)
    const user = userEvent.setup()
    renderWithProviders(<Tree />, { route: '/login' })

    await user.type(screen.getByLabelText('Usuário'), 'emilys')
    await user.type(screen.getByLabelText('Senha'), 'emilyspass')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('heading', { name: 'Painel admin' })).toBeInTheDocument()
    expect(login).toHaveBeenCalledWith('emilys', 'emilyspass')
    expect(localStorage.getItem('balcao.session')).toContain('jwt-de-teste')
  })

  it('exibe mensagem amigável quando as credenciais estão erradas', async () => {
    vi.mocked(login).mockRejectedValue(new ApiError('Invalid credentials', { status: 400 }))
    const user = userEvent.setup()
    renderWithProviders(<Tree />, { route: '/login' })

    await user.type(screen.getByLabelText('Usuário'), 'emilys')
    await user.type(screen.getByLabelText('Senha'), 'errada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Usuário ou senha incorretos'))
    expect(screen.queryByRole('heading', { name: 'Painel admin' })).not.toBeInTheDocument()
  })
})
