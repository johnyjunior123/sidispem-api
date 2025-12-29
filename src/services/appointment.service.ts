import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from 'src/dto/appointment';

@Injectable()
export class AppointmentService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async create(appointment: CreateAppointmentDTO) {
        return await this.prismaService.appointment.create({
            data: appointment
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
