import { useCallback, useEffect, useState, type DependencyList } from 'react'
import { toApiError, type ApiError } from '../services/api'

interface RequestState<T> {
  data: T | null
  error: ApiError | null
  loading: boolean
}

/**
 * Executa `fetcher` sempre que `deps` mudar, tratando carregamento, sucesso e erro.
 * Requisições antigas são canceladas no cleanup, evitando respostas fora de ordem.
 * Os dados anteriores são mantidos durante o recarregamento (bom para overlays).
 */
export function useRequest<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<RequestState<T>>({ data: null, error: null, loading: true })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((current) => ({ ...current, error: null, loading: true }))

    fetcher(controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState((current) => ({ ...current, error: toApiError(error), loading: false }))
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  return { ...state, reload }
}
