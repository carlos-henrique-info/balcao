import { useState } from 'react'
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  NumberInput,
  Paper,
  Rating,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconArrowLeft, IconShoppingCartPlus } from '@tabler/icons-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PriceTag } from '../components/PriceTag'
import { StateMessage } from '../components/StateMessage'
import { useCart } from '../hooks/useCart'
import { useProduct } from '../hooks/useProducts'
import { humanizeSlug } from '../utils/format'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { addItem } = useCart()
  const { data: product, error, reload } = useProduct(id)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)

  // Se o usuário abriu o link direto, "voltar" leva ao catálogo em vez de sair do site.
  function goBack() {
    if (location.key !== 'default') navigate(-1)
    else navigate('/')
  }

  const backButton = (
    <Button variant="subtle" leftSection={<IconArrowLeft size={16} aria-hidden />} onClick={goBack} w="fit-content">
      Voltar
    </Button>
  )

  if (error?.status === 404) {
    return (
      <StateMessage title="Produto não encontrado" message="Esse produto não existe ou foi removido.">
        {backButton}
      </StateMessage>
    )
  }

  if (error && !product) {
    return (
      <Stack>
        {backButton}
        <Alert color="red" title="Não foi possível carregar o produto" role="alert">
          <Group justify="space-between">
            <Text size="sm">{error.message}</Text>
            <Button size="xs" variant="white" color="red" onClick={reload}>
              Tentar novamente
            </Button>
          </Group>
        </Alert>
      </Stack>
    )
  }

  if (!product) {
    return (
      <Box pos="relative" mih={320}>
        <LoadingOverlay visible loaderProps={{ 'aria-label': 'Carregando produto' }} />
      </Box>
    )
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const currentImage = images[Math.min(selectedImage, images.length - 1)]
  const outOfStock = product.stock <= 0

  function handleAdd() {
    if (!product) return
    addItem(product, quantity)
    notifications.show({
      color: 'teal',
      message: `${quantity} × ${product.title} no carrinho.`,
    })
  }

  return (
    <Stack gap="lg">
      {backButton}

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        <Stack gap="sm">
          <Paper withBorder radius="md" p="md" bg="white">
            <Image src={currentImage} alt={product.title} h={380} fit="contain" />
          </Paper>
          {images.length > 1 && (
            <Group gap="xs" role="group" aria-label="Fotos do produto">
              {images.map((src, index) => (
                <UnstyledButton
                  key={src}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-pressed={index === selectedImage}
                  style={{
                    border: `2px solid ${index === selectedImage ? 'var(--mantine-color-cobalt-6)' : 'transparent'}`,
                    borderRadius: 8,
                    background: '#fff',
                  }}
                >
                  <Image src={src} alt="" w={64} h={64} fit="contain" />
                </UnstyledButton>
              ))}
            </Group>
          )}
        </Stack>

        <Stack gap="md">
          <Group gap="xs">
            <Badge variant="light">{humanizeSlug(product.category)}</Badge>
            {product.brand && <Badge variant="outline" color="gray">{product.brand}</Badge>}
          </Group>
          <Title order={1}>{product.title}</Title>
          <Group gap="xs">
            <Rating value={product.rating} fractions={2} readOnly aria-label={`Nota ${product.rating.toFixed(1)} de 5`} />
            <Text size="sm" c="dimmed">
              {product.rating.toFixed(1)} · {product.reviews.length} {product.reviews.length === 1 ? 'avaliação' : 'avaliações'}
            </Text>
          </Group>

          <PriceTag price={product.price} discountPercentage={product.discountPercentage} size="lg" />

          <Text>{product.description}</Text>

          <Text size="sm" c={outOfStock ? 'red' : 'teal.8'} fw={500}>
            {outOfStock ? 'Produto esgotado' : `${product.stock} em estoque`}
          </Text>

          <Group align="flex-end">
            <NumberInput
              label="Quantidade"
              value={quantity}
              onChange={(value) => setQuantity(typeof value === 'number' ? value : 1)}
              min={1}
              max={Math.max(product.stock, 1)}
              allowDecimal={false}
              w={110}
              disabled={outOfStock}
            />
            <Button
              onClick={handleAdd}
              disabled={outOfStock}
              leftSection={<IconShoppingCartPlus size={18} aria-hidden />}
            >
              Adicionar ao carrinho
            </Button>
          </Group>

          {product.tags.length > 0 && (
            <Group gap={6} aria-label="Tags">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="dot" color="gray" size="sm">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>
      </SimpleGrid>

      {product.reviews.length > 0 && (
        <section aria-labelledby="reviews-title">
          <Divider my="md" />
          <Title order={2} id="reviews-title" size="h3" mb="md">
            O que as pessoas dizem
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {product.reviews.map((review) => (
              <Paper key={`${review.reviewerName}-${review.date}`} withBorder p="md" bg="white">
                <Rating value={review.rating} readOnly size="sm" aria-label={`Nota ${review.rating} de 5`} />
                <Text mt="xs">{review.comment}</Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {review.reviewerName}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </section>
      )}
    </Stack>
  )
}
