import { useState } from 'react'
import { Alert, Button, Code, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loginFormSchema, type LoginFormValues } from '../schemas/auth'
import { toApiError } from '../services/api'

interface LocationState {
  from?: string
}

export function LoginPage() {
  const { isAuthenticated, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/admin'

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    initialValues: { username: '', password: '' },
    validate: zodResolver(loginFormSchema),
  })

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(values: LoginFormValues) {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await signIn(values.username, values.password)
      navigate(from, { replace: true })
    } catch (error) {
      const apiError = toApiError(error)
      setErrorMessage(
        apiError.status === 400 ? 'Usuário ou senha incorretos. Confira os dados e tente de novo.' : apiError.message,
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Paper withBorder bg="white" p="xl" maw={420} mx="auto" mt="xl" component="section" aria-labelledby="login-title">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack>
          <div>
            <Title order={1} size="h2" id="login-title">
              Entrar
            </Title>
            <Text size="sm" c="dimmed">
              Acesse a área administrativa para cadastrar e gerenciar produtos.
            </Text>
          </div>

          {errorMessage && (
            <Alert color="red" role="alert">
              {errorMessage}
            </Alert>
          )}

          <TextInput
            label="Usuário"
            autoComplete="username"
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Senha"
            autoComplete="current-password"
            {...form.getInputProps('password')}
          />

          <Button type="submit" loading={submitting}>
            Entrar
          </Button>

          <Text size="xs" c="dimmed">
            Para testar, use <Code>emilys</Code> e <Code>emilyspass</Code> (usuário de demonstração da DummyJSON).
          </Text>
        </Stack>
      </form>
    </Paper>
  )
}
