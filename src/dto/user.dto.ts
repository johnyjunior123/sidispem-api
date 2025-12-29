import { z } from 'zod'

const userSchema = z.object({
    name: z.string('O nome é obrigatório').min(10),
    email: z.email('E-mail inválido').min(5),
})

export const createUserSchema = userSchema.extend({
    password: z.string().min(8),
    token: z.string().refine(
        element => element === process.env.VERIFY_CREATE_USER
        , 'Não autorizado'
    )
})

export type createUserDTO = z.infer<typeof createUserSchema>