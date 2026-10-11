import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { notifications } from '@mantine/notifications'
import { getStoredToken } from './session'

export class ApiError extends Error {
  readonly status?: number
  readonly isNetworkError: boolean

  constructor(message: string, options: { status?: number; isNetworkError?: boolean } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.isNetworkError = options.isNetworkError ?? false
  }
}

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15_000,
})

/** Injeta o JWT salvo no navegador em toda requisição. */
export function attachToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getStoredToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
}

/** Converte qualquer falha do Axios em uma mensagem amigável. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>

    if (!axiosError.response) {
      const message =
        axiosError.code === 'ECONNABORTED'
          ? 'O servidor demorou demais para responder. Tente novamente.'
          : 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      return new ApiError(message, { isNetworkError: true })
    }

    const { status, data } = axiosError.response
    if (status >= 500) {
      return new ApiError('O servidor está com problemas no momento. Tente novamente em instantes.', { status })
    }
    if (status === 404) {
      return new ApiError(data?.message ?? 'Não encontramos o que você procurava.', { status })
    }
    if (status === 401 || status === 403) {
      return new ApiError(data?.message ?? 'Você não tem permissão para esta ação.', { status })
    }
    return new ApiError(data?.message ?? 'Não foi possível concluir a solicitação.', { status })
  }

  return new ApiError('Ocorreu um erro inesperado.')
}

api.interceptors.request.use(attachToken)

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Requisições canceladas (cleanup de useEffect) não são falhas de verdade.
    if (axios.isCancel(error)) return Promise.reject(error)

    const apiError = toApiError(error)

    // Falhas de rede e de servidor viram aviso global; erros de negócio
    // (ex.: senha incorreta) ficam por conta de quem chamou.
    if (apiError.isNetworkError || (apiError.status !== undefined && apiError.status >= 500)) {
      notifications.show({
        id: 'api-failure',
        color: 'red',
        title: 'Falha de comunicação',
        message: apiError.message,
      })
    }

    return Promise.reject(apiError)
  },
)
