import { describe, expect, it } from 'vitest'
import { loginResponseSchema } from './auth'
import { productFormSchema, productSchema, productsResponseSchema } from './product'

describe('productSchema', () => {
  it('aceita um produto mínimo e preenche os valores padrão', () => {
    const result = productSchema.safeParse({
      id: 1,
      title: 'Teclado',
      description: 'Teclado mecânico',
      category: 'laptops',
      price: 50,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.tags).toEqual([])
      expect(result.data.discountPercentage).toBe(0)
    }
  })

  it('rejeita produto sem título', () => {
    expect(productSchema.safeParse({ id: 1, price: 10 }).success).toBe(false)
  })

  it('valida a resposta paginada da listagem', () => {
    const result = productsResponseSchema.safeParse({ products: [], total: 0, skip: 0, limit: 12 })
    expect(result.success).toBe(true)
  })
})

describe('productFormSchema', () => {
  const valid = {
    title: 'Cadeira gamer',
    description: 'Cadeira ergonômica com apoio lombar.',
    category: 'furniture',
    price: 199.9,
    stock: 5,
  }

  it('aceita dados válidos', () => {
    expect(productFormSchema.safeParse(valid).success).toBe(true)
  })

  it('devolve mensagens amigáveis para dados inválidos', () => {
    const result = productFormSchema.safeParse({ ...valid, title: 'ab', price: -1, stock: 1.5 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message)
      expect(messages).toContain('Informe um título com pelo menos 3 caracteres')
      expect(messages).toContain('O preço deve ser maior que zero')
      expect(messages).toContain('O estoque deve ser um número inteiro')
    }
  })
})

describe('loginResponseSchema', () => {
  const base = { id: 1, username: 'emilys' }

  it('normaliza accessToken para token', () => {
    const result = loginResponseSchema.parse({ ...base, accessToken: 'abc', refreshToken: 'x' })
    expect(result.token).toBe('abc')
    expect(result.user.username).toBe('emilys')
  })

  it('aceita o formato antigo com `token`', () => {
    expect(loginResponseSchema.parse({ ...base, token: 'legacy' }).token).toBe('legacy')
  })

  it('falha quando a resposta não traz token', () => {
    expect(loginResponseSchema.safeParse(base).success).toBe(false)
  })
})
