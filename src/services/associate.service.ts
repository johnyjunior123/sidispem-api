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
        return await this.prismaService.associate.create({
            data: newAssociate,
        })
    }

    async update(associate: Partial<Omit<UpdateAssociateDTO, 'id'>> & { id: number }, imgPerfil?: Express.Multer.File) {
        let newAssociate = await this.prismaService.associate.findFirstOrThrow({
            where: { id: associate.id }
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
            }
        }
        else {
            newAssociate = {
                ...newAssociate,
                ...associate,
            }
        }
        return await this.prismaService.associate.update({
            where: {
                id: associate.id
            },
            data: newAssociate
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
}