import { createContext } from 'react'
import type { Session, SessionUser } from '../schemas/auth'

export interface AuthContextValue {
  session: Session | null
  user: SessionUser | null
  isAuthenticated: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
