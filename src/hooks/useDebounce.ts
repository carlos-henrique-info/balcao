import { useEffect, useState } from 'react'

/** Devolve `value` apenas depois de `delay` ms sem mudanças. */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    // Cleanup: cancela o timer se o valor mudar (ou o componente sair da tela).
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
