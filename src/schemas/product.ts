import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string().optional(),
})

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number().default(0),
  rating: z.number().default(0),
  stock: z.number().default(0),
  tags: z.array(z.string()).default([]),
  brand: z.string().optional(),
  sku: z.string().optional(),
  availabilityStatus: z.string().optional(),
  thumbnail: z.string().default(''),
  images: z.array(z.string()).default([]),
  reviews: z.array(reviewSchema).default([]),
})

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string().optional(),
})

export const categoriesResponseSchema = z.array(categorySchema)

export const productFormSchema = z.object({
  title: z.string().trim().min(3, 'Informe um título com pelo menos 3 caracteres'),
  description: z.string().trim().min(10, 'Descreva o produto com pelo menos 10 caracteres'),
  category: z.string().min(1, 'Escolha uma categoria'),
  brand: z.string().trim().optional(),
  price: z
    .number({ invalid_type_error: 'Informe o preço' })
    .positive('O preço deve ser maior que zero'),
  stock: z
    .number({ invalid_type_error: 'Informe o estoque' })
    .int('O estoque deve ser um número inteiro')
    .min(0, 'O estoque não pode ser negativo'),
})

export type Review = z.infer<typeof reviewSchema>
export type Product = z.infer<typeof productSchema>
export type ProductsResponse = z.infer<typeof productsResponseSchema>
export type Category = z.infer<typeof categorySchema>
export type ProductFormValues = z.infer<typeof productFormSchema>
