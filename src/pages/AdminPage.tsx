import { useState } from 'react'
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Pagination,
  Paper,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { LOCAL_ID_START } from '../contexts/AdminChangesContext'
import { useAdminChanges } from '../hooks/useAdminChanges'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../schemas/product'
import { toApiError } from '../services/api'
import { deleteProduct, PAGE_SIZE } from '../services/products'
import { formatPrice, humanizeSlug } from '../utils/format'

export function AdminPage() {
  const { user } = useAuth()
  const { created, updated, removedIds, markRemoved } = useAdminChanges()
  const [page, setPage] = useState(1)
  const [toDelete, setToDelete] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { data, error, loading, reload } = useProducts({ page, search: '', category: '', sort: 'relevance' })

  const apiProducts = (data?.products ?? [])
    .filter((product) => !removedIds.includes(product.id))
    .map((product) => updated[product.id] ?? product)
  // Itens criados nesta sessão aparecem no topo da primeira página.
  const rows = page === 1 ? [...created, ...apiProducts] : apiProducts
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0

  async function confirmDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      if (toDelete.id < LOCAL_ID_START) {
        await deleteProduct(toDelete.id)
      }
      markRemoved(toDelete.id)
      notifications.show({ color: 'teal', message: `"${toDelete.title}" foi removido (simulado).` })
      setToDelete(null)
    } catch (err) {
      notifications.show({ color: 'red', title: 'Não foi possível remover', message: toApiError(err).message })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={1}>Administração</Title>
          <Text c="dimmed">Olá, {user?.firstName ?? user?.username}. Gerencie os produtos do catálogo.</Text>
        </div>
        <Button component={Link} to="/admin/produtos/novo" leftSection={<IconPlus size={16} aria-hidden />}>
          Novo produto
        </Button>
      </Group>

      <Alert color="blue" variant="light">
        A DummyJSON apenas simula criação, edição e remoção. As mudanças valem durante esta sessão do navegador e
        somem ao recarregar a página.
      </Alert>

      {error && !data && (
        <Alert color="red" title="Não foi possível carregar os produtos" role="alert">
          <Group justify="space-between">
            <Text size="sm">{error.message}</Text>
            <Button size="xs" variant="white" color="red" onClick={reload}>
              Tentar novamente
            </Button>
          </Group>
        </Alert>
      )}

      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={loading} loaderProps={{ 'aria-label': 'Carregando produtos' }} />
        {data && (
          <Paper withBorder bg="white" style={{ overflowX: 'auto' }}>
            <Table verticalSpacing="sm" highlightOnHover aria-label="Produtos cadastrados">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Produto</Table.Th>
                  <Table.Th>Categoria</Table.Th>
                  <Table.Th>Preço</Table.Th>
                  <Table.Th>Estoque</Table.Th>
                  <Table.Th>
                    <span style={{ position: 'absolute', left: -9999 }}>Ações</span>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((product) => {
                  const isLocal = product.id >= LOCAL_ID_START
                  return (
                    <Table.Tr key={product.id}>
                      <Table.Td>
                        <Group wrap="nowrap">
                          {product.thumbnail && <Image src={product.thumbnail} alt="" w={40} h={40} fit="contain" />}
                          <Text fw={500}>{product.title}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{humanizeSlug(product.category)}</Table.Td>
                      <Table.Td>{formatPrice(product.price)}</Table.Td>
                      <Table.Td>{product.stock}</Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap" justify="flex-end">
                          {isLocal ? (
                            <Tooltip label="Itens criados nesta sessão não podem ser editados">
                              <ActionIcon variant="subtle" disabled aria-label={`Editar ${product.title}`}>
                                <IconEdit size={18} />
                              </ActionIcon>
                            </Tooltip>
                          ) : (
                            <ActionIcon
                              variant="subtle"
                              component={Link}
                              to={`/admin/produtos/${product.id}/editar`}
                              aria-label={`Editar ${product.title}`}
                            >
                              <IconEdit size={18} />
                            </ActionIcon>
                          )}
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => setToDelete(product)}
                            aria-label={`Remover ${product.title}`}
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          </Paper>
        )}
      </Box>

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </Group>
      )}

      <Modal opened={toDelete !== null} onClose={() => setToDelete(null)} title="Remover produto?" centered>
        <Stack>
          <Text>
            Você vai remover <strong>{toDelete?.title}</strong>. Como a API é uma simulação, nada muda no servidor.
          </Text>
          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={() => setToDelete(null)}>
              Cancelar
            </Button>
            <Button color="red" loading={deleting} onClick={confirmDelete}>
              Remover
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
