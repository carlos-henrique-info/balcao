import { expect, test } from '@playwright/test'
import { validUser } from './fixtures'
import { mockApi } from './mock-api'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test.describe('Fluxo de autenticação', () => {
  test('redireciona visitante para o login e volta ao painel depois de entrar', async ({ page }) => {
    // 1. Rota protegida sem sessão -> login
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()

    // 2. Credenciais erradas mostram erro e mantêm o usuário no login
    await page.getByLabel('Usuário').fill('emilys')
    await page.getByLabel('Senha').fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByRole('alert')).toContainText('Usuário ou senha incorretos')
    await expect(page).toHaveURL(/\/login$/)

    // 3. Credenciais corretas levam de volta à rota que o usuário tentou abrir
    await page.getByLabel('Senha').fill(validUser.password)
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByRole('heading', { name: 'Administração' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Administração' })).toBeVisible()

    // 4. A sessão sobrevive a um recarregamento (token no localStorage)
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Administração' })).toBeVisible()

    // 5. Sair bloqueia a área administrativa de novo
    await page.getByRole('button', { name: /^Sair/ }).click()
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('valida os campos do formulário antes de chamar a API', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Informe o usuário')).toBeVisible()
    await expect(page.getByText('Informe a senha')).toBeVisible()
  })
})
