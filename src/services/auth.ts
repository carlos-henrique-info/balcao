import { api, ApiError } from './api'
import { loginResponseSchema, type Session } from '../schemas/auth'

export async function login(username: string, password: string): Promise<Session> {
  const { data } = await api.post<unknown>('/auth/login', { username, password, expiresInMins: 60 })
  const parsed = loginResponseSchema.safeParse(data)
  if (!parsed.success) {
    throw new ApiError('Resposta inesperada do servidor ao fazer login.')
  }
  return parsed.data
}
