import { Body, Controller, Delete, Get, Param, Post, Put, Res, UsePipes } from "@nestjs/common";
import type { Response } from "express";
import { success_messages } from "src/constants/success.message";
import { CreateWorkspaceSchema, type UpdateWorkspaceDTO, UpdateWorkspaceSchema, type CreateWorkspaceDTO } from "src/dto/workspace.dto";
import { ZodValidationPipe } from "src/pipes/zod.validation.pipe";
import { WorkspaceService } from "src/services/workspace.service";

@Controller('/workspace')
export class WorkspaceController {
    constructor(private readonly workSpaceService: WorkspaceService) { }

    @Get('/:id')
    async getWorkspace(@Param('id') id: string, @Res() res: Response) {
        const workspace = await this.workSpaceService.get(Number(id))
        return res.status(200).json(workspace)
    }

    @Get('/')
    async getAllWorkspaces(@Res() res: Response) {
        const workspaces = await this.workSpaceService.getAll()
        return res.status(200).json(workspaces)
    }

    @Post('/')
    @UsePipes(new ZodValidationPipe(CreateWorkspaceSchema))
    async createWorkspace(
        @Body() body: CreateWorkspaceDTO,
        @Res() res: Response
    ) {
        const newWorkspace = await this.workSpaceService.create(body)
        return res.status(201).json(newWorkspace)
    }

    @Put('/')
    @UsePipes(new ZodValidationPipe(UpdateWorkspaceSchema))
    async updateWorkspace(
        @Body() body: UpdateWorkspaceDTO,
        @Res() res: Response
    ) {
        const newWorkspace = await this.workSpaceService.update(body)
        return res.status(200).json(newWorkspace)
    }

    @Delete('/:id')
    async deleteWorkspace(@Param('id') id: string, @Res() res: Response) {
        const result = await this.workSpaceService.delete(Number(id))
        return res.status(200).json({ message: success_messages.deleted_item })
    }
}