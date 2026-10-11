import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { login } from '../services/auth'
import { clearSession, readSession, saveSession, SESSION_KEY } from '../services/session'
import type { Session } from '../schemas/auth'

interface AuthProviderProps {
  children: ReactNode
  /** Permite iniciar com uma sessão em memória (útil em testes). */
  initialSession?: Session | null
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(() =>
    initialSession !== undefined ? initialSession : readSession(),
  )

  // Mantém várias abas sincronizadas: login/logout em uma reflete nas outras.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === SESSION_KEY || event.key === null) {
        setSession(readSession())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const signIn = useCallback(async (username: string, password: string) => {
    const newSession = await login(username, password)
    saveSession(newSession)
    setSession(newSession)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      signIn,
      signOut,
    }),
    [session, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
