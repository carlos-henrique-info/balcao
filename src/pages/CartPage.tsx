import { ActionIcon, Button, Group, Image, NumberInput, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { StateMessage } from '../components/StateMessage'
import { useCart } from '../hooks/useCart'
import { discountedPrice, formatPrice } from '../utils/format'

export function CartPage() {
  const { items, subtotal, totalItems, setQuantity, removeItem, clear } = useCart()

  function handleCheckout() {
    clear()
    notifications.show({
      color: 'teal',
      title: 'Pedido simulado',
      message: 'Nenhuma cobrança foi feita: este é um projeto de demonstração.',
    })
  }

  if (items.length === 0) {
    return (
      <StateMessage title="Seu carrinho está vazio" message="Adicione produtos do catálogo para vê-los aqui.">
        <Button component={Link} to="/">
          Ver catálogo
        </Button>
      </StateMessage>
    )
  }

  return (
    <Stack gap="lg">
      <Title order={1}>Carrinho</Title>

      <Paper withBorder bg="white" style={{ overflowX: 'auto' }}>
        <Table verticalSpacing="sm" aria-label="Itens do carrinho">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Produto</Table.Th>
              <Table.Th>Preço</Table.Th>
              <Table.Th>Quantidade</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>
                <span style={{ position: 'absolute', left: -9999 }}>Ações</span>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map(({ product, quantity }) => {
              const unit = discountedPrice(product.price, product.discountPercentage)
              return (
                <Table.Tr key={product.id}>
                  <Table.Td>
                    <Group wrap="nowrap">
                      <Image src={product.thumbnail} alt="" w={48} h={48} fit="contain" />
                      <Text component={Link} to={`/produtos/${product.id}`} fw={500} c="inherit">
                        {product.title}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{formatPrice(unit)}</Table.Td>
                  <Table.Td>
                    <NumberInput
                      aria-label={`Quantidade de ${product.title}`}
                      value={quantity}
                      min={1}
                      max={99}
                      allowDecimal={false}
                      w={90}
                      onChange={(value) => typeof value === 'number' && setQuantity(product.id, value)}
                    />
                  </Table.Td>
                  <Table.Td fw={600}>{formatPrice(unit * quantity)}</Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remover ${product.title}`}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </Paper>

      <Group justify="space-between" align="flex-end">
        <Button variant="subtle" color="gray" onClick={clear}>
          Esvaziar carrinho
        </Button>
        <Stack gap={4} align="flex-end">
          <Text c="dimmed" size="sm">
            {totalItems} {totalItems === 1 ? 'item' : 'itens'}
          </Text>
          <Text size="xl" fw={700} ff="heading">
            Total: {formatPrice(subtotal)}
          </Text>
          <Button onClick={handleCheckout}>Finalizar compra (simulação)</Button>
        </Stack>
      </Group>
    </Stack>
  )
}
