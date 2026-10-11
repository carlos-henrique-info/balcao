import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from './useAuth'
import { useCart } from './useCart'
import { useDebounce } from './useDebounce'

describe('hooks de contexto', () => {
  it('useAuth lança erro fora do AuthProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useAuth())).toThrow('useAuth precisa ser usado dentro de um <AuthProvider>')
  })

  it('useCart lança erro fora do CartProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useCart())).toThrow('useCart precisa ser usado dentro de um <CartProvider>')
  })
})

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('só atualiza o valor depois do atraso', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('ab')
  })

  it('reinicia o timer a cada mudança (cleanup do efeito)', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ value: 'abc' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('abc')
  })
})
