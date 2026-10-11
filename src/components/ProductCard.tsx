import { Badge, Button, Card, Group, Image, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconShoppingCartPlus } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import type { Product } from '../schemas/product'
import { humanizeSlug } from '../utils/format'
import { PriceTag } from './PriceTag'
import classes from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const outOfStock = product.stock <= 0

  function handleAdd() {
    addItem(product)
    notifications.show({
      color: 'teal',
      message: `${product.title} foi adicionado ao carrinho.`,
    })
  }

  return (
    <Card withBorder padding="md" className={classes.card} component="article">
      <Card.Section>
        <Link to={`/produtos/${product.id}`} tabIndex={-1} aria-hidden>
          <Image src={product.thumbnail} alt="" className={classes.media} loading="lazy" />
        </Link>
      </Card.Section>

      <Stack gap="xs" mt="md" style={{ flex: 1 }}>
        <Badge variant="light" size="sm" w="fit-content">
          {humanizeSlug(product.category)}
        </Badge>
        <Link to={`/produtos/${product.id}`} className={classes.title}>
          {product.title}
        </Link>
        <Text size="sm" c="dimmed" lineClamp={2}>
          {product.description}
        </Text>
      </Stack>

      <Group justify="space-between" align="flex-end" mt="md" wrap="nowrap">
        <PriceTag price={product.price} discountPercentage={product.discountPercentage} />
        <Button
          size="compact-md"
          variant="light"
          onClick={handleAdd}
          disabled={outOfStock}
          leftSection={<IconShoppingCartPlus size={16} aria-hidden />}
          aria-label={`Adicionar ${product.title} ao carrinho`}
        >
          {outOfStock ? 'Esgotado' : 'Adicionar'}
        </Button>
      </Group>
    </Card>
  )
}
