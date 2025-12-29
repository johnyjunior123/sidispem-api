import { z } from 'zod'

export type AppointmentFront = {
    id: string | undefined
    title: string
    start: string
    end: string
    local: string
    receptor: string
}

export const CreateAppointmentSchema = z.object({
    description: z.string().min(1, 'Descrição obrigatória'),

    start: z.string()
        .min(1)
        .transform(date => new Date(date)),

    end: z.string()
        .min(1)
        .transform(date => new Date(date)),

    workspaceId: z.string()
        .min(1)
        .transform(id => Number(id)),

    userId: z.string()
        .min(1)
        .transform(id => Number(id)),
})

export const UpdateAppointmentSchema = CreateAppointmentSchema.extend({
    id: z.string()
        .min(1)
        .transform(id => Number(id)),
})

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>
export type UpdateAppointmentDTO = z.infer<typeof UpdateAppointmentSchema>
