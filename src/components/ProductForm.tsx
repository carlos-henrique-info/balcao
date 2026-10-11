import { useState } from 'react'
import { Alert, Button, Group, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { productFormSchema, type Category, type ProductFormValues } from '../schemas/product'
import { toApiError } from '../services/api'

interface ProductFormProps {
  initialValues: ProductFormValues
  categories: Category[]
  submitLabel: string
  onSubmit: (values: ProductFormValues) => Promise<void>
  onCancel: () => void
}

export function ProductForm({ initialValues, categories, submitLabel, onSubmit, onCancel }: ProductFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ProductFormValues>({
    initialValues,
    validate: zodResolver(productFormSchema),
  })

  async function handleSubmit(values: ProductFormValues) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await onSubmit(values)
    } catch (error) {
      setErrorMessage(toApiError(error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack>
        {errorMessage && (
          <Alert color="red" role="alert">
            {errorMessage}
          </Alert>
        )}

        <TextInput label="Título" withAsterisk {...form.getInputProps('title')} />
        <Textarea label="Descrição" withAsterisk autosize minRows={3} {...form.getInputProps('description')} />

        <Group grow align="flex-start">
          <Select
            label="Categoria"
            placeholder="Escolha uma categoria"
            withAsterisk
            searchable
            data={categories.map((item) => ({ value: item.slug, label: item.name }))}
            {...form.getInputProps('category')}
          />
          <TextInput label="Marca" {...form.getInputProps('brand')} />
        </Group>

        <Group grow align="flex-start">
          <NumberInput
            label="Preço (US$)"
            withAsterisk
            decimalScale={2}
            fixedDecimalScale
            min={0}
            {...form.getInputProps('price')}
          />
          <NumberInput label="Estoque" withAsterisk allowDecimal={false} min={0} {...form.getInputProps('stock')} />
        </Group>

        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={submitting}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
