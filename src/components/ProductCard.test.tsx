import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useCart } from '../hooks/useCart'
import { fakeProduct, renderWithProviders } from '../test/utils'
import { ProductCard } from './ProductCard'

function CartCounter() {
  const { totalItems } = useCart()
  return <p>Itens no carrinho: {totalItems}</p>
}

describe('ProductCard', () => {
  it('mostra título, categoria e preço com desconto', () => {
    renderWithProviders(<ProductCard product={fakeProduct} />)

    expect(screen.getByRole('link', { name: 'Perfume Aurora' })).toHaveAttribute('href', '/produtos/7')
    expect(screen.getByText('Fragrances')).toBeInTheDocument()
    expect(screen.getByText('-10%')).toBeInTheDocument()
    // 100 com 10% de desconto = 90
    expect(screen.getByText(/90,00/)).toBeInTheDocument()
  })

  it('adiciona ao carrinho quando o usuário clica em "Adicionar"', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <>
        <ProductCard product={fakeProduct} />
        <CartCounter />
      </>,
    )

    expect(screen.getByText('Itens no carrinho: 0')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /adicionar perfume aurora ao carrinho/i }))
    expect(screen.getByText('Itens no carrinho: 1')).toBeInTheDocument()
  })

  it('desabilita o botão quando o produto está esgotado', () => {
    renderWithProviders(<ProductCard product={{ ...fakeProduct, stock: 0 }} />)
    expect(screen.getByRole('button', { name: /adicionar perfume aurora/i })).toBeDisabled()
    expect(screen.getByText('Esgotado')).toBeInTheDocument()
  })
})
