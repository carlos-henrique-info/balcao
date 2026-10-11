import { describe, expect, it } from 'vitest'
import { categories, loginResponse, products } from '../../e2e/fixtures'
import { loginResponseSchema } from '../schemas/auth'
import { categoriesResponseSchema, productSchema } from '../schemas/product'

// Garante que os dados usados nos testes E2E respeitam os mesmos schemas do app.
describe('fixtures dos testes E2E', () => {
  it('produtos são válidos', () => {
    for (const item of products) expect(productSchema.safeParse(item).success).toBe(true)
  })
  it('categorias são válidas', () => {
    expect(categoriesResponseSchema.safeParse(categories).success).toBe(true)
  })
  it('resposta de login é válida', () => {
    expect(loginResponseSchema.safeParse(loginResponse).success).toBe(true)
  })
})
