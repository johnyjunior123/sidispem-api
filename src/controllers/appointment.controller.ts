import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { type Response } from "express";
import { type AppointmentFront, CreateAppointmentSchema, UpdateAppointmentSchema } from "src/dto/appointment";
import { AppointmentService } from "src/services/appointment.service";
@Controller('appointment')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post()
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
        return res.status(201).json(newAppointment)
    }

    @Get('/')
    async getAll(@Res() res: Response) {
        return res.status(200).json(await this.appointmentService.getAll())
    }

    @Get('/:id')
    async get(@Param('id') id: string, @Res() res: Response) {
        return res.status(200).json(await this.appointmentService.get(Number(id)))
    }

    @Delete('/:id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        await this.appointmentService.delete(Number(id))
        return res.status(200)
    }
}