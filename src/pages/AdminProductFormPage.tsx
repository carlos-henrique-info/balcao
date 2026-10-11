import { Alert, Box, Button, LoadingOverlay, Paper, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm } from '../components/ProductForm'
import { StateMessage } from '../components/StateMessage'
import { useAdminChanges } from '../hooks/useAdminChanges'
import { useCategories, useProduct } from '../hooks/useProducts'
import type { ProductFormValues } from '../schemas/product'
import { createProduct, updateProduct } from '../services/products'

const EMPTY_VALUES: ProductFormValues = {
  title: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
}

/** Serve as duas rotas: /admin/produtos/novo e /admin/produtos/:id/editar. */
export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = id !== undefined
  const navigate = useNavigate()
  const { addCreated, saveUpdated } = useAdminChanges()

  const categories = useCategories()
  const product = useProduct(id)

  async function handleSubmit(values: ProductFormValues) {
    if (isEditing && product.data) {
      const saved = await updateProduct(product.data.id, values)
      // A API devolve só o que foi enviado; mesclamos com o produto original.
      saveUpdated({ ...product.data, ...saved, ...values })
      notifications.show({ color: 'teal', message: 'Produto atualizado (simulado).' })
    } else {
      const saved = await createProduct(values)
      addCreated({ ...saved, ...values })
      notifications.show({ color: 'teal', message: 'Produto criado (simulado).' })
    }
    navigate('/admin')
  }

  const loadError = categories.error ?? (isEditing ? product.error : null)
  const ready = categories.data && (!isEditing || product.data)

  if (isEditing && product.error?.status === 404) {
    return (
      <StateMessage title="Produto não encontrado" message="Não existe um produto com esse código.">
        <Button onClick={() => navigate('/admin')}>Voltar para a administração</Button>
      </StateMessage>
    )
  }

  const initialValues: ProductFormValues =
    isEditing && product.data
      ? {
          title: product.data.title,
          description: product.data.description,
          category: product.data.category,
          brand: product.data.brand ?? '',
          price: product.data.price,
          stock: product.data.stock,
        }
      : EMPTY_VALUES

  return (
    <Stack gap="lg" maw={640} mx="auto">
      <div>
        <Title order={1}>{isEditing ? 'Editar produto' : 'Novo produto'}</Title>
        <Text c="dimmed">Campos com asterisco são obrigatórios.</Text>
      </div>

      {loadError && (
        <Alert color="red" title="Não foi possível carregar os dados do formulário" role="alert">
          {loadError.message}
        </Alert>
      )}

      <Paper withBorder bg="white" p="lg">
        <Box pos="relative" mih={160}>
          <LoadingOverlay visible={!ready && !loadError} loaderProps={{ 'aria-label': 'Carregando formulário' }} />
          {ready && (
            <ProductForm
              initialValues={initialValues}
              categories={categories.data ?? []}
              submitLabel={isEditing ? 'Salvar alterações' : 'Criar produto'}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/admin')}
            />
          )}
        </Box>
      </Paper>
    </Stack>
  )
}
