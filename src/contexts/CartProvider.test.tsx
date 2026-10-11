import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useCart } from '../hooks/useCart'
import { fakeProduct, renderWithProviders } from '../test/utils'

function CartProbe() {
  const { items, totalItems, subtotal, addItem, removeItem, clear } = useCart()
  return (
    <div>
      <p data-testid="total-items">{totalItems}</p>
      <p data-testid="subtotal">{subtotal.toFixed(2)}</p>
      <p data-testid="lines">{items.length}</p>
      <button onClick={() => addItem(fakeProduct)}>adicionar</button>
      <button onClick={() => removeItem(fakeProduct.id)}>remover</button>
      <button onClick={clear}>limpar</button>
    </div>
  )
}

describe('CartProvider', () => {
  it('soma a quantidade ao adicionar o mesmo produto duas vezes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartProbe />)

    await user.click(screen.getByRole('button', { name: 'adicionar' }))
    await user.click(screen.getByRole('button', { name: 'adicionar' }))

    expect(screen.getByTestId('lines')).toHaveTextContent('1')
    expect(screen.getByTestId('total-items')).toHaveTextContent('2')
  })

  it('calcula o subtotal com desconto (100 com 10% = 90 por unidade)', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartProbe />)

    await user.click(screen.getByRole('button', { name: 'adicionar' }))
    await user.click(screen.getByRole('button', { name: 'adicionar' }))

    expect(screen.getByTestId('subtotal')).toHaveTextContent('180.00')
  })

  it('remove e limpa itens', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CartProbe />, { cartItems: [{ product: fakeProduct, quantity: 3 }] })

    expect(screen.getByTestId('total-items')).toHaveTextContent('3')
    await user.click(screen.getByRole('button', { name: 'remover' }))
    expect(screen.getByTestId('total-items')).toHaveTextContent('0')
  })
})
