import { SimpleGrid } from '@mantine/core'
import type { Product } from '../schemas/product'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md" component="section" aria-label="Produtos">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SimpleGrid>
  )
}
