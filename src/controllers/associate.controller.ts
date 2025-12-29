import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { errors_message } from "src/constants/errors.message";
import { type CreateAssociateDTO, CreateAssociateSchema, type UpdateAssociateDTO, UpdateAssociateSchema } from "src/dto/associate.dto";
import { AssociateService } from "src/services/associate.service";


@Controller('/associate')
export class AssociateController {
    constructor(private readonly associateService: AssociateService) { }

    @Get('/:id')
    async getAssociate(@Param('id') id: string, @Res() res: Response) {
        const associate = await this.associateService.get(Number(id))
        return res.status(200).json(associate)
    }

    @Get('/validar/:registration')
    async getAssociateByMatricula(@Param('registration') registration: string, @Res() res: Response) {
        const associate = await this.associateService.getByMatricula(registration)
        if (!associate) {
            return res.status(400).json({ message: errors_message.missing_data })
        }
        return res.status(200).json(associate)
    }

    @Get('/')
    async getAllAssociate(@Res() res: Response) {
        const associates = await this.associateService.getAll()
        return res.status(200).json(associates)
    }

    @Post('/')
    @UseInterceptors(FileInterceptor('imgPerfil'))
    async createAssociate(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateAssociateDTO,
        @Res() res: Response
    ) {
        const validated = CreateAssociateSchema.parse(body);
        const newAssociate = await this.associateService.create(validated, file)
        return res.status(201).json(newAssociate)
    }

    @Put('/')
    @UseInterceptors(FileInterceptor('imgPerfil'))
    async updateAssociate(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: UpdateAssociateDTO,
        @Res() res: Response
    ) {
        const validated = UpdateAssociateSchema.parse(body);
        const newAssociate = await this.associateService.update(validated, file)
        return res.status(201).json(newAssociate)
    }

    @Delete('/:id')
    async deleteAssociate(@Param('id') id: string, @Res() res: Response) {
        const result = await this.associateService.delete(Number(id))
        return res.status(200).json({ message: 'deleted successful' })
    }

    @Get('/:id/card')
    async getCardAssociate(@Res() res: Response) {
        const pdf = await this.associateService.gerarCarteirinha();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=carteirinha.pdf',
        });

        res.send(pdf);
    }

    @Get("/dashboard/all")
    async getDataDashboard(@Res() res: Response) {
        const data = await this.associateService.getAllDashboard()
        res.status(200).json(data)
    }
}