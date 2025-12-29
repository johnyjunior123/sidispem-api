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
    cpf: z.string().length(11, 'CPF obrigatório'),
    registration: z.string().min(1),
    status: z.enum(AssociateStatus),
    situation: z.enum(AssociateSituation),
    birthday: z.string().transform(date => new Date(date)),
    workspace: z.string().transform(data => Number(data))
})

export const UpdateAssociateSchema = CreateAssociateSchema.extend({
    id: z.string().min(1).transform(id => Number(id))
})

export type CreateAssociateDTO = z.infer<typeof CreateAssociateSchema>

export type UpdateAssociateDTO = z.infer<typeof UpdateAssociateSchema>