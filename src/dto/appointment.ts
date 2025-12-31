import { z } from 'zod'
import { toZonedTime } from 'date-fns-tz'

const timeZone = 'America/Sao_Paulo'

export type AppointmentFront = {
    id: string | undefined
    title: string
    start: string
    end: string
    local: string
    receptor: string
}

export const CreateAppointmentSchema = z.object({
    description: z.string().min(1),

    start: z.string()
        .min(1)
        .transform(date =>
            toZonedTime(date, timeZone)
        ),

    end: z.string()
        .min(1)
        .transform(date =>
            toZonedTime(date, timeZone)
        ),

    workspaceId: z.string()
        .transform(Number),

    userId: z.string()
        .transform(Number),
})

export const UpdateAppointmentSchema = CreateAppointmentSchema.extend({
    id: z.string()
        .min(1)
        .transform(id => Number(id)),
})

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>
export type UpdateAppointmentDTO = z.infer<typeof UpdateAppointmentSchema>
