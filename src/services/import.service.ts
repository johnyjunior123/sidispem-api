import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateAppointmentDTO } from 'src/dto/appointment';
import { AssociateSituation, AssociateStatus } from 'src/dto/associate.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';

type AssociateImport = {
    matricula: string
    local: string
    name: string
    cpf: string
}

function extrairNumerosCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
}

@Injectable()
export class ImportService {
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

    async create(newworkspace: AssociateImport, imgPerfil?: Express.Multer.File) {
        let workspace = await this.prismaService.workspace.findFirst({
            where: {
                name: newworkspace.local
            }
        })
        if (!workspace) {
            workspace = await this.prismaService.workspace.create({
                data: {
                    name: newworkspace.local
                },
            })
        }
        let imgPerfilkey: string | null = ''

        if (imgPerfil) {
            const Key = `${v4()}.jpg`
            this.s3.send(new PutObjectCommand({
                Key,
                Bucket: process.env.BUCKET_NAME,
                Body: imgPerfil.buffer
            }))
            imgPerfilkey = Key
        }
        else {
            imgPerfilkey = null
        }

        return await this.prismaService.associate.create({
            data: {
                status: AssociateStatus.ACTIVE,
                situation: AssociateSituation.AFFECTIVE,
                name: newworkspace.name,
                registration: newworkspace.matricula,
                cpf: extrairNumerosCpf(newworkspace.cpf),
                imgPerfil: imgPerfilkey,
                workspace: {
                    connect: {
                        id: workspace.id
                    }
                }
            },

        })
    }

    async getAll() {
        return await this.prismaService.appointment.findMany()
    }

    async get(id: number) {
        return await this.prismaService.appointment.findFirst({ where: { id } })
    }

    async update(appointment: UpdateAppointmentDTO) {
        const { id, workspaceId, userId, ...data } = appointment
        return await this.prismaService.appointment.update({
            where: { id },
            data: {
                ...data,
                local: {
                    connect: {
                        id: workspaceId
                    }
                },
                receptor: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    async delete(id: number) {
        return await this.prismaService.appointment.delete({ where: { id } })
    }
}
