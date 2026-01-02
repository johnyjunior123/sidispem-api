import { CreateAssociateDTO, UpdateAssociateDTO } from "src/dto/associate.dto";
import { PrismaService } from "./prisma.service";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 } from "uuid";
import { Injectable } from "@nestjs/common";

type CreateAssociateDTOWithoutIMGPerfil = Omit<CreateAssociateDTO, 'imgPerfil'> & {
    imgPerfil: string | null
}

type UpdateAssociateDTOWithoutIMGPerfil = Omit<UpdateAssociateDTO, 'imgPerfil'> & {
    imgPerfil: string | null
}

@Injectable()
export class AssociateService {
    private s3: S3Client;

    constructor(private readonly prismaService: PrismaService) {
        this.s3 = new S3Client({
            region: 'auto',
            endpoint: process.env.ENDPOINT_URL,
            credentials: {
                accessKeyId: process.env.R2_KEY!,
                secretAccessKey: process.env.R2_KEY_SECRETS!,
            },
        });
    }
    async create(associate: CreateAssociateDTO, imgPerfil?: Express.Multer.File) {
        let newAssociate: CreateAssociateDTOWithoutIMGPerfil
        if (imgPerfil) {
            const Key = `${v4()}.jpg`
            this.s3.send(new PutObjectCommand({
                Key,
                Bucket: process.env.BUCKET_NAME,
                Body: imgPerfil.buffer
            }))
            newAssociate = {
                ...associate,
                imgPerfil: Key,
            }
        }
        else {
            newAssociate = {
                ...associate,
                imgPerfil: null,
            }
        }
        const workspace = await this.prismaService.workspace.findFirst({ where: { id: newAssociate.workspace } })
        return await this.prismaService.associate.create({
            data: {
                ...newAssociate,
                workspace: {
                    connect: {
                        id: newAssociate.workspace
                    }
                }
            }
        })
    }

    async update(associate: Partial<Omit<UpdateAssociateDTO, 'id'>> & { id: number }, imgPerfil?: Express.Multer.File) {
        let newAssociate = await this.prismaService.associate.findFirstOrThrow({
            where: { id: associate.id },
            omit: { userId: true }
        })
        if (imgPerfil) {
            const Key = `${v4()}.jpg`
            this.s3.send(new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: newAssociate.imgPerfil?.split('.jpg')[0]
            }))
            this.s3.send(new PutObjectCommand({
                Key,
                Bucket: process.env.BUCKET_NAME,
                Body: imgPerfil.buffer
            }))
            newAssociate = {
                ...newAssociate,
                ...associate,
                imgPerfil: Key,
                workspaceId: Number(associate.workspace)
            }
        }
        else {
            newAssociate = {
                ...newAssociate,
                ...associate,
                workspaceId: Number(associate.workspace)
            }
        }
        const { id, workspaceId, ...data } = newAssociate
        return await this.prismaService.associate.update({
            where: { id },
            data: {
                ...data,
                workspace: {
                    connect: {
                        id: Number(workspaceId)
                    }
                }
            }
        })
    }

    async getAll() {
        return await this.prismaService.associate.findMany()
    }

    async get(id: number) {
        return await this.prismaService.associate.findFirst({ where: { id } })
    }

    async delete(id: number) {
        const associate = await this.get(id)
        if (associate) {
            this.s3.send(new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: associate.imgPerfil?.split('.jpg')[0]
            }))
            await this.prismaService.associate.delete({ where: { id } })
        }
    }

    async getAllDashboard() {
        const associatesByTypeRaw = await this.prismaService.associate.groupBy({
            by: ['situation'],
            _count: {
                situation: true,
            },
        })

        const associatesByType = {
            hired:
                associatesByTypeRaw.find(
                    item => item.situation === 'CONTRATADO',
                )?._count.situation || 0,

            commissioned:
                associatesByTypeRaw.find(
                    item => item.situation === 'COMISSIONADO',
                )?._count.situation || 0,

            affective:
                associatesByTypeRaw.find(
                    item => item.situation === 'EFETIVO',
                )?._count.situation || 0,
        }

        const totalAssociates =
            associatesByType.hired +
            associatesByType.commissioned +
            associatesByType.affective

        const schedulingRaw = await this.prismaService.associate.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        })

        const schedulingData = [
            {
                name: 'Ativos',
                value:
                    schedulingRaw.find(item => item.status === 'ATIVO')
                        ?._count.status || 0,
                color: '#22c55e',
            },
            {
                name: 'Pendentes',
                value:
                    schedulingRaw.find(item => item.status === 'PENDENTE')
                        ?._count.status || 0,
                color: '#3b82f6',
            },
            {
                name: 'Suspensos',
                value:
                    schedulingRaw.find(item => item.status === 'SUSPENSO')
                        ?._count.status || 0,
                color: '#ef4444',
            },
        ]

        const associatesByLocationRaw =
            await this.prismaService.workspace.findMany({
                select: {
                    name: true,
                    _count: {
                        select: {
                            associates: true,
                        },
                    },
                },
            })

        const associatesByLocation = associatesByLocationRaw.map(workspace => ({
            name: workspace.name,
            total: workspace._count.associates,
        }))

        return {
            associatesByType,
            totalAssociates,
            schedulingData,
            associatesByLocation,
        }
    }

    async getByMatricula(registration: string) {
        return await this.prismaService.associate.findFirst({
            where: {
                registration
            }
        })
    }
}