import { z } from 'zod'

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, 'Informe o usuário'),
  password: z.string().min(1, 'Informe a senha'),
})

export const sessionUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().optional(),
})

// A DummyJSON retorna o JWT em `accessToken` (versões antigas usavam `token`).
// Aceitamos os dois e normalizamos para `token`.
export const loginResponseSchema = sessionUserSchema
  .extend({
    accessToken: z.string().optional(),
    token: z.string().optional(),
  })
  .transform((data, ctx) => {
    const { accessToken, token: legacyToken, ...user } = data
    const token = accessToken ?? legacyToken
    if (!token) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'A resposta de login não trouxe um token' })
      return z.NEVER
    }
    return { token, user }
  })

export const sessionSchema = z.object({
  token: z.string().min(1),
  user: sessionUserSchema,
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type SessionUser = z.infer<typeof sessionUserSchema>
export type Session = z.infer<typeof sessionSchema>
