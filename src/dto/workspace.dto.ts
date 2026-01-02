import { errors_message } from 'src/constants/errors.message';
import { z } from 'zod';

export const CreateWorkspaceSchema = z.object({
    name: z.string().min(1, errors_message.generic_required),
})

export const UpdateWorkspaceSchema = CreateWorkspaceSchema.extend({
    id: z.number()
})

export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceSchema>
export type UpdateWorkspaceDTO = z.infer<typeof UpdateWorkspaceSchema>

export type Workspace = {
    id: number
    name: string
} & CreateWorkspaceDTO