import { Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

interface StateMessageProps {
  title: string
  message: string
  /** Ação sugerida ao usuário (botão ou link), passada como `children`. */
  children?: ReactNode
  role?: 'alert' | 'status'
}

export function StateMessage({ title, message, children, role = 'status' }: StateMessageProps) {
  return (
    <Stack align="center" gap="xs" py="xl" ta="center" role={role}>
      <Title order={3}>{title}</Title>
      <Text c="dimmed" maw={460}>
        {message}
      </Text>
      {children}
    </Stack>
  )
}
