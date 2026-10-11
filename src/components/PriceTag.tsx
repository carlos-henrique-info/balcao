import { discountedPrice, formatPrice } from '../utils/format'
import classes from './PriceTag.module.css'

interface PriceTagProps {
  price: number
  discountPercentage: number
  size?: 'md' | 'lg'
}

export function PriceTag({ price, discountPercentage, size = 'md' }: PriceTagProps) {
  const hasDiscount = discountPercentage >= 1
  const finalPrice = hasDiscount ? discountedPrice(price, discountPercentage) : price

  return (
    <span className={classes.wrap}>
      <span className={classes.price} style={{ fontSize: size === 'lg' ? '2rem' : '1.25rem' }}>
        {formatPrice(finalPrice)}
      </span>
      {hasDiscount && (
        <>
          <span className={classes.original} aria-label={`Preço original ${formatPrice(price)}`}>
            {formatPrice(price)}
          </span>
          <span className={classes.tag}>-{Math.round(discountPercentage)}%</span>
        </>
      )}
    </span>
  )
}
