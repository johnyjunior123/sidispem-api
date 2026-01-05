import { Body, Controller, Delete, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { errors_message } from "src/constants/errors.message";
import { type CreateAssociateDTO, CreateAssociateSchema, type UpdateAssociateDTO, UpdateAssociateSchema } from "src/dto/associate.dto";
import { JwtAuthGuard } from "src/filter/auth/jwt.auth.guard";
import { Roles, UserRolesEnum } from "src/filter/auth/rbac";
import { RolesGuard } from "src/filter/auth/roles.guard";
import { AssociateService } from "src/services/associate.service";


@Controller('/associate')
export class AssociateController {
    constructor(private readonly associateService: AssociateService) { }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ATENDENTE)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ATENDENTE)
    async getAllAssociate(@Res() res: Response) {
        const associates = await this.associateService.getAll()
        return res.status(200).json(associates)
    }

    @Post('/')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ATENDENTE)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ATENDENTE)
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ATENDENTE)
    async deleteAssociate(@Param('id') id: string, @Res() res: Response) {
        const result = await this.associateService.delete(Number(id))
        return res.status(200).json({ message: 'deleted successful' })
    }

    @Get("/dashboard/all")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ATENDENTE)
    async getDataDashboard(@Res() res: Response) {
        const data = await this.associateService.getAllDashboard()
        res.status(200).json(data)
    }
}