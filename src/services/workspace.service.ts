import { PrismaService } from "./prisma.service";
import { Injectable } from "@nestjs/common";
import { CreateWorkspaceDTO, Workspace } from "src/dto/workspace.dto";

@Injectable()
export class WorkspaceService {

    constructor(private readonly prismaService: PrismaService) { }

    async create(workspace: CreateWorkspaceDTO) {
        return await this.prismaService.workspace.create({
            data: workspace,
        })
    }

    async update(workspace: Workspace) {
        let oldWorkspace = await this.prismaService.workspace.findFirstOrThrow({
            where: { id: workspace.id }
        })
        return await this.prismaService.workspace.update({
            where: {
                id: workspace.id
            },
            data: {
                ...oldWorkspace,
                ...workspace
            }
        })
    }

    async getAll() {
        const workspaces = await this.prismaService.workspace.findMany({
            include: {
                _count: {
                    select: {
                        associates: true,
                    },
                },
            },
        })

        return workspaces.map(workspace => ({
            id: workspace.id,
            name: workspace.name,
            count: workspace._count.associates,
        }))
    }

    async get(id: number) {
        return await this.prismaService.workspace.findFirst({ where: { id } })
    }

    async delete(id: number) {
        await this.prismaService.workspace.delete({ where: { id } })
    }
}