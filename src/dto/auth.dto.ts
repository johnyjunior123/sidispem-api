import { z } from "zod";

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})

export type SignInDTO = z.infer<typeof signInSchema>