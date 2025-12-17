import { z } from 'zod'

export enum AssociateStatus {
    ACTIVE = "ATIVO",
    SUSPENDED = "SUSPENSO",
    PENDING = "PENDENTE"
}

export enum AssociateSituation {
    AFFECTIVE = "EFETIVO",
    HIRED = "CONTRATADO",
    COMMISSIONED = "COMISSIONADO"
}

export const CreateAssociateSchema = z.object({
    name: z.string().min(1),
    registration: z.string().min(1),
    status: z.enum(AssociateStatus),
    situation: z.enum(AssociateSituation),
    birthday: z.string().transform(date => new Date(date)),
})

export const UpdateAssociateSchema = CreateAssociateSchema.extend({
    id: z.number().min(1)
})

export type CreateAssociateDTO = z.infer<typeof CreateAssociateSchema>

export type UpdateAssociateDTO = z.infer<typeof UpdateAssociateSchema>