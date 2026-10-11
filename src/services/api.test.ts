import { AxiosError, type InternalAxiosRequestConfig, AxiosHeaders } from 'axios'
import { afterEach, describe, expect, it } from 'vitest'
import { attachToken, toApiError } from './api'
import { saveSession } from './session'

function makeConfig(): InternalAxiosRequestConfig {
  return { headers: new AxiosHeaders() } as InternalAxiosRequestConfig
}

function makeHttpError(status: number, message?: string) {
  return new AxiosError('falha', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: makeConfig(),
    data: message ? { message } : {},
  })
}

afterEach(() => localStorage.clear())

describe('interceptor de requisição', () => {
  it('injeta o Bearer token quando há sessão', () => {
    saveSession({ token: 'abc123', user: { id: 1, username: 'emilys' } })
    const config = attachToken(makeConfig())
    expect(config.headers.get('Authorization')).toBe('Bearer abc123')
  })

  it('não envia Authorization sem sessão', () => {
    const config = attachToken(makeConfig())
    expect(config.headers.get('Authorization')).toBeUndefined()
  })
})

describe('toApiError', () => {
  it('trata falha de rede com mensagem amigável', () => {
    const error = toApiError(new AxiosError('Network Error', 'ERR_NETWORK'))
    expect(error.isNetworkError).toBe(true)
    expect(error.message).toMatch(/conectar ao servidor/i)
  })

  it('trata timeout', () => {
    const error = toApiError(new AxiosError('timeout', 'ECONNABORTED'))
    expect(error.message).toMatch(/demorou demais/i)
  })

  it('esconde detalhes técnicos de erros 5xx', () => {
    const error = toApiError(makeHttpError(503))
    expect(error.status).toBe(503)
    expect(error.message).toMatch(/problemas no momento/i)
  })

  it('reaproveita a mensagem da API em erros 4xx', () => {
    const error = toApiError(makeHttpError(400, 'Invalid credentials'))
    expect(error.status).toBe(400)
    expect(error.message).toBe('Invalid credentials')
  })
})
