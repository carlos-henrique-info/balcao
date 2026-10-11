const usd = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD' })

export function formatPrice(value: number): string {
  return usd.format(value)
}

/** Preço final depois do desconto, arredondado para centavos. */
export function discountedPrice(price: number, discountPercentage: number): number {
  return Math.round(price * (1 - discountPercentage / 100) * 100) / 100
}

/** Remove o `slug` da categoria para exibição: "home-decoration" -> "Home decoration". */
export function humanizeSlug(slug: string): string {
  const text = slug.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
