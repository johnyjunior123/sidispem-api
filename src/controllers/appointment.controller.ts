import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { type Response } from "express";
import { type AppointmentFront, CreateAppointmentSchema, UpdateAppointmentSchema } from "src/dto/appointment";
import { JwtAuthGuard } from "src/filter/auth/jwt.auth.guard";
import { Roles, UserRolesEnum } from "src/filter/auth/rbac";
import { RolesGuard } from "src/filter/auth/roles.guard";
import { AppointmentService } from "src/services/appointment.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post()
    @Roles(UserRolesEnum.PRESIDENTE)
    async create(@Body() appointment: AppointmentFront, @Res() res: Response) {
        const parsed = CreateAppointmentSchema.parse({
            description: appointment.title,
            start: appointment.start,
            end: appointment.end,
            workspaceId: appointment.local,
            userId: appointment.receptor,
        })
        const newAppointment = await this.appointmentService.create(parsed)
        return res.status(201).json(newAppointment)
    }

    @Put()
    @Roles(UserRolesEnum.PRESIDENTE)
    async update(@Body() appointment: AppointmentFront, @Res() res: Response) {
        const parsed = UpdateAppointmentSchema.parse({
            id: appointment.id,
            description: appointment.title,
            start: appointment.start,
            end: appointment.end,
            workspaceId: appointment.local,
            userId: appointment.receptor,
        })
        const newAppointment = await this.appointmentService.update(parsed)
        return res.status(200).json(newAppointment)
    }

    @Get('/')
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ADVOGADO, UserRolesEnum.ATENDENTE)
    async getAll(@Res() res: Response) {
        return res.status(200).json(await this.appointmentService.getAll())
    }

    @Get('/:id')
    @Roles(UserRolesEnum.PRESIDENTE, UserRolesEnum.ADVOGADO, UserRolesEnum.ATENDENTE)
    async get(@Param('id') id: string, @Res() res: Response) {
        return res.status(200).json(await this.appointmentService.get(Number(id)))
    }

    @Delete('/:id')
    @Roles(UserRolesEnum.PRESIDENTE)
    async delete(@Param('id') id: string, @Res() res: Response) {
        await this.appointmentService.delete(Number(id))
        return res.status(200)
    }
}